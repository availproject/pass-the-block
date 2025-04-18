import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { LensReputationScore, RawFollower } from '../types/network';

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
    owner
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
    pageInfo {
      next
      prev
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

// Add the new accountsAvailable query
const ACCOUNTS_AVAILABLE = gql`
  query AccountsAvailable($request: AccountsAvailableRequest!) {
    accountsAvailable(request: $request) {
      items {
        ... on AccountManaged {
          account {
            address
            username {
              value
            }
            metadata {
              name
              picture
            }
          }
          permissions {
            canExecuteTransactions
            canTransferTokens
            canTransferNative
            canSetMetadataUri
          }
          addedAt
        }
        ... on AccountOwned {
          account {
            address
            username {
              value
            }
            metadata {
              name
              picture
            }
          }
          addedAt
        }
      }
    }
  }
`;

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

    let lensReputationScore: LensReputationScore | undefined = undefined;
    try {
      const owner = result.data.account.owner;
      const lensAccountAddress = result.data.account.address;
      const lensRepResponse = await fetch(`https://lensreputation.xyz/api/public/sbt?wallet=${owner}&lensAccountAddress=${lensAccountAddress}`);
      if (lensRepResponse.ok) {
        lensReputationScore = await lensRepResponse.json();
        console.log('📈 LensReputation score found:', lensReputationScore);
      }
    } catch (err) {
      console.warn('Error while fetching LensReputation score:', err);
    }

    const { account, accountStats } = result.data;

    const followerData = {
      id: account.address,
      name: account.username.localName,
      picture: account.metadata?.picture || 'default_image.png',
      followers: accountStats.graphFollowStats.followers,
      following: accountStats.graphFollowStats.following,
      posts: accountStats.feedStats.posts,
      lensScore: account.score,
      address: account.address, // Store address for API calls
      lensReputationScore
    };

    console.log('✅ Account metadata processed:', {
      id: followerData.id,
      name: followerData.name,
      followers: followerData.followers,
      posts: followerData.posts,
      address: followerData.address,
      lensReputationScore
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
    let batchCount = 0;
    const maxBatches = 2;

    while (batchCount < maxBatches) {
      console.log('🔄 Current cursor:', cursor);
      
      const result: { 
        data?: { 
          followers?: { 
            items: FollowerItem[]; 
            pageInfo?: { 
              next: string | null 
            } 
          } 
        } 
      } = await apolloClient.query({
        query: GET_FOLLOWER_DETAILS,
        variables: {
          request: {
            account: accountAddress,
            orderBy: "ACCOUNT_SCORE",
            cursor: cursor
          }
        }
      });

      const followerItems = result.data?.followers?.items || [];
      if (!followerItems.length) break;

      console.log(`📊 Processing batch ${batchCount + 1}, followers found:`, followerItems.length);

      // Process followers in current batch
      const followerPromises = followerItems.map(async (item: FollowerItem) => {
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
          name: follower.username.localName,
          picture: follower.metadata?.picture || "default_image.png",
          followers: statsResult.data.accountStats.graphFollowStats.followers,
          following: statsResult.data.accountStats.graphFollowStats.following,
          posts: statsResult.data.accountStats.feedStats.posts,
          lensScore: follower.score,
          address: follower.address
        };
      });

      const batchFollowers = await Promise.all(followerPromises);
      allFollowers.push(...batchFollowers);

      batchCount++;
      if (batchCount >= maxBatches) break;

      const nextCursor = result.data?.followers?.pageInfo?.next;
      console.log('📑 Next cursor:', nextCursor);
      
      cursor = nextCursor ?? null;
      if (!cursor) break;
    }

    console.log('✅ All followers processed:', {
      totalFollowers: allFollowers.length,
      batchesProcessed: batchCount
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
    
    // Use Apollo to fetch accounts by address using the new accountsAvailable query
    console.log('📡 Making GraphQL request with accountsAvailable...');
    const result = await apolloClient.query({
      query: ACCOUNTS_AVAILABLE,
      variables: {
        request: {
          managedBy: formattedAddress,
          includeOwned: true
        }
      }
    });
    
    console.log('📊 GraphQL response:', {
      hasData: !!result.data,
      hasAccountsAvailable: !!result.data?.accountsAvailable,
      itemsCount: result.data?.accountsAvailable?.items?.length || 0,
      rawResponse: result.data
    });
    
    const items = result.data?.accountsAvailable?.items || [];
    
    // If we found accounts, return the first one
    if (items.length > 0) {
      // Get the first account (prefer owned accounts if available)
      const ownedAccount = items.find((item: any) => 'account' in item && !('permissions' in item));
      const managedAccount = items.find((item: any) => 'account' in item && 'permissions' in item);
      
      const accountItem = ownedAccount || managedAccount || items[0];
      const account = 'account' in accountItem ? accountItem.account : null;
      
      if (account) {
        console.log('✅ Found account:', {
          address: account.address,
          username: account.username,
          metadata: account.metadata
        });
        
        // Format the handle properly
        const handle = account.username?.value 
          ? {
              fullHandle: account.username.value.replace('lens/', ''),
              localName: account.username.value.replace('lens/', '')
            }
          : null;

        return {
          id: account.address,
          handle,
          metadata: account.metadata || null,
          address: account.address
        };
      }
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