import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { RawFollower } from '../types/network';
import { evmAddress, PublicClient, mainnet  } from '@lens-protocol/client';
import { fetchAccountsAvailable, follow } from '@lens-protocol/client/actions';

// Initialize Apollo Client
const apolloClient = new ApolloClient({
  uri: 'https://api.lens.xyz/graphql',
  cache: new InMemoryCache()
});

// GraphQL Queries

// Query to get Account Details with just Lens Handle
const ACCOUNT_METADATA = gql`
query AccountStats($accountStatsRequest: AccountStatsRequest!, $accountRequest: AccountRequest!) {
  accountStats(request: $accountStatsRequest) {
    feedStats {
      posts
      tips
      collects
    }
    graphFollowStats {
      followers
      following
    }
  }
  account(request: $accountRequest) {
    address
    username {
      id
      localName
      value
    }
    metadata {
      picture
      name
    }
    score
  }
}
`;

// Query to get Account stats by passing Lens Handle
const ACCOUNT_STATS = gql`
query AccountStats($request: AccountStatsRequest!) {
  accountStats(request: $request) {
    feedStats {
      posts
      tips
      collects
    }
    graphFollowStats {
      followers
      following
    }
  }
}
`;

// Updated query to match Lens API schema
const GET_FOLLOWER_DETAILS = gql`
query Followers($request: FollowersRequest!) {
  followers(request: $request) {
    items {
      follower {
        address
        username {
          id
          localName
          value
        }
        metadata {
          picture
          name
        }
        score
      }
    }
  }
}
`;

// Query to fetch profiles by wallet address
const GET_PROFILES_BY_ADDRESS = gql`
  query ProfilesByAddress($request: ProfilesRequest!) {
    profiles(request: $request) {
      items {
        id
        handle {
          fullHandle
          localName
        }
        metadata {
          picture {
            ... on ImageSet {
              optimized {
                uri
              }
            }
          }
        }
        stats {
          followers
          following
          lensClassifierScore
        }
      }
    }
  }
`;

// Add a new query for batch stats
const GET_BATCH_STATS = gql`
  query BatchStats($usernames: [String!]!) {
    batchStats(usernames: $usernames) {
      username
      stats {
        followers
        following
      }
    }
  }
`;

// Update the accountsBulk query to only include supported fields
const GET_ACCOUNTS_BULK = gql`
  query AccountsBulk($request: AccountsBulkRequest!) {
    accountsBulk(request: $request) {
      address
      username {
        id
        localName
        value
      }
      metadata {
        name
        picture
        bio
        coverPicture
      }
    }
  }
`;

// New public client for modern Lens API interactions
export const publicClient = PublicClient.create({
  environment: mainnet,
  origin: typeof window !== 'undefined' ? window.location.origin : 'lenscollective.me',
});

interface FollowerItem {
  follower: {
    address: string;
    username: {
      localName: string;
    };
    metadata?: {
      picture?: string;
    };
    score: number;
  };
}

interface BatchStatsResponse {
  batchStats: Array<{
    username: string;
    stats?: {
      followers: number;
      following: number;
    };
  }>;
}

export async function getAccountMetadata(lensHandle: string): Promise<RawFollower> {
  console.log('🔍 Fetching account metadata for handle:', lensHandle);
  
  try {
    const result = await apolloClient.query({
      query: ACCOUNT_METADATA,
      variables: { accountStatsRequest: { 
        username: {
            localName: lensHandle
          }
        },
        accountRequest: {
          username: {
            localName: lensHandle
          }
        }
      }
    });
    
    console.log('📊 Account metadata query result:', {
      hasData: !!result.data,
      hasAccount: !!result.data?.account,
      hasStats: !!result.data?.accountStats
    });

    const { account, accountStats } = result.data;

    const followerData = {
      id: account.address,
      name: `lens/${account.username.localName}`,
      picture: account.metadata?.picture || 'default_profile.png',
      followers: accountStats.graphFollowStats.followers,
      following: accountStats.graphFollowStats.following,
      lensScore: account.score,
      address: account.address // Store address for API calls
    };

    console.log('✅ Account metadata processed:', {
      id: followerData.id,
      name: followerData.name,
      followers: followerData.followers,
      address: followerData.address
    });

    return followerData;
  } catch (error) {
    console.error('❌ Error fetching account metadata:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function getAccountStats(lensHandle: string) {
  const result = await apolloClient.query({
    query: ACCOUNT_STATS,
    variables: { request: 
      { username: 
        {
          localName: lensHandle
        }
      }}
  });

  const accountStats = result.data
  
  return {
    posts: accountStats.feedStats.posts,
    tips: accountStats.feedStats.tips,
    collects: accountStats.feedStats.collects,
    followers: accountStats.graphFollowStats.followers,
    following: accountStats.graphFollowStats.following
  };
}

export async function getFollowerDetails(accountAddress: string, limit: number = 150): Promise<RawFollower[]> {
  console.log('🔍 Fetching follower details for address:', accountAddress);
  
  try {
    let allFollowers: RawFollower[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore && allFollowers.length < limit) {
      const result: { data: { followers: { items: FollowerItem[]; pageInfo: { nextCursor: string | null } } } } = await apolloClient.query({
        query: GET_FOLLOWER_DETAILS,
        variables: {
          request: {
            account: accountAddress,
            orderBy: "ACCOUNT_SCORE",
            cursor: cursor
          }
        }
      });

      console.log('📊 Follower details query result:', {
        hasData: !!result.data,
        hasFollowers: !!result.data?.followers,
        followerCount: result.data?.followers?.items?.length || 0,
        currentTotal: allFollowers.length
      });

      const followerItems = result.data.followers.items;
      const batchSize = 25;
      const followerData: RawFollower[] = [];

      // Process followers in batches of 25
      for (let i = 0; i < followerItems.length; i += batchSize) {
        const batch = followerItems.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${i / batchSize + 1} of ${Math.ceil(followerItems.length / batchSize)}`);

        // Process each follower in the batch
        const batchPromises = batch.map(async (item: FollowerItem) => {
          const follower = item.follower;
          const statsResult = await apolloClient.query({
            query: ACCOUNT_STATS,
            variables: {
              request: {
                username: {
                  localName: follower.username.localName
                }
              }
            }
          });

          return {
            id: follower.address,
            name: `lens/${follower.username.localName}`,
            picture: follower.metadata?.picture || "default_profile.png",
            followers: statsResult.data.accountStats.graphFollowStats.followers,
            following: statsResult.data.accountStats.graphFollowStats.following,
            lensScore: follower.score,
            address: follower.address
          };
        });

        // Wait for all promises in the batch to complete
        const batchResults = await Promise.all(batchPromises);
        followerData.push(...batchResults);
      }

      allFollowers.push(...followerData);

      // Check if we have more followers to fetch
      hasMore = result.data?.followers?.pageInfo?.nextCursor !== null;
      cursor = result.data?.followers?.pageInfo?.nextCursor;

      // Stop if we've reached our limit
      if (allFollowers.length >= limit) {
        allFollowers = allFollowers.slice(0, limit);
        break;
      }
    }

    console.log('✅ All followers processed:', {
      totalFollowers: allFollowers.length
    });

    return allFollowers;
  } catch (error) {
    console.error('❌ Error fetching follower details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 

/**
 * Fetches a Lens account using a wallet address via Apollo GraphQL
 * @param address The wallet address to fetch the account for
 * @returns The Lens account if found, null otherwise
 */
export async function fetchAccountByAddress(address: string) {
  if (!address) {
    console.log('❌ No address provided to fetchAccountByAddress');
    return null;
  }
  
  try {
    // Format address to lowercase for consistency
    const formattedAddress = address.toLowerCase();
    console.log('🔍 Fetching account for address:', formattedAddress);
    
    // Use Apollo to fetch accounts by address
    console.log('📡 Making GraphQL request...');
    const result = await apolloClient.query({
      query: GET_ACCOUNTS_BULK,
      variables: {
        request: {
          addresses: [formattedAddress]
        }
      }
    });
    
    console.log('📊 GraphQL response:', {
      hasData: !!result.data,
      hasAccountsBulk: !!result.data?.accountsBulk,
      accountsCount: result.data?.accountsBulk?.length || 0,
      rawResponse: result.data
    });
    
    const accounts = result.data?.accountsBulk || [];
    
    // If we found accounts, return the first one
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('✅ Found account:', {
        address: account.address,
        username: account.username,
        metadata: account.metadata
      });
      
      // Format the handle properly
      const handle = account.username?.value 
        ? {
            fullHandle: account.username.value,
            localName: account.username.localName || account.username.value.replace('lens/', '')
          }
        : null;

      return {
        id: account.address,
        handle,
        metadata: account.metadata || null,
        address: account.address
      };
    }
    
    console.log('⚠️ No accounts found for address:', formattedAddress);
    return null;
  } catch (error) {
    console.error('❌ Error fetching Lens account:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}

/**
 * Fetches a Lens account using the new Lens client API (for future use)
 * @param address The wallet address to fetch the account for
 * @returns The Lens account if found, null otherwise
 */
export async function fetchAccountByAddressNewMethod(address: string) {
  // This method will be implemented once the Lens API supports the accountsAvailable query
  // For now, it just returns null to avoid errors
  return null;
  
  /* 
  This implementation will work once the Lens API is updated to support the accountsAvailable query:
  
  if (!address) return null;
  
  try {
    // Format address to lowercase for consistency
    const formattedAddress = address.toLowerCase();
    
    // TODO: Implementation with the new Lens client API will go here when available
    
    return null;
  } catch (error) {
    console.error('Error fetching Lens account by address using new method:', error);
    return null;
  }
  */
}