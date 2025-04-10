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

// Get follower details by passing Account Address
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

// New public client for modern Lens API interactions
export const publicClient = PublicClient.create({
  environment: mainnet,
  origin: typeof window !== 'undefined' ? window.location.origin : 'lenscollective.me',
});

export async function getAccountMetadata(lensHandle: string): Promise<RawFollower> {
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
  
  const { account, accountStats } = result.data;

  return {
    id: account.username.id,
    address: account.address,
    handle: account.username.localName,
    fullHandle: account.username.value,
    picture: account.metadata?.picture,
    name: account.metadata?.name,
    lensScore: account.score,
    posts: accountStats.feedStats.posts,
    tips: accountStats.feedStats.tips,
    collects: accountStats.feedStats.collects,
    followers: accountStats.graphFollowStats.followers,
    following: accountStats.graphFollowStats.following
  };
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

export async function getFollowerDetails(accountAddress: string): Promise<RawFollower[]> {
  //get Follower Details
  const result = await apolloClient.query({
    query: GET_FOLLOWER_DETAILS,
    variables: {
      request: {
        account: accountAddress,
        orderBy: "ACCOUNT_SCORE",
        pageSize: "TEN"
      }
    }
  });

  const followerItems = result.data.followers.items;


  const followerData = await Promise.all(
  followerItems.map(async (item: any) => {
    const follower = item.follower;

    // Fetch stats for this follower
    const statsResult = await apolloClient.query({
      query: ACCOUNT_STATS,
      variables:  {
        request: {
          username: {
            localName: follower.username.localName
          }
        }
      }
    });

    const stats = statsResult.data;

    return {
      id: follower.username?.id,
      address: follower.address,
      handle: follower.username.localName || `user_${follower.id}`,
      fullHandle: follower.username.value,
      picture: follower.metadata?.picture || "default_image.png",
      name: follower.metadata?.name || `user_${follower.username.id}`,
      lensScore: follower.score,
      posts: stats.accountStats.feedStats.posts,
      tips: stats.accountStats.feedStats.tips,
      collects: stats.accountStats.feedStats.collects,
      followers: stats.accountStats.graphFollowStats.followers,
      following: stats.accountStats.graphFollowStats.following
    };
  })
);

  return followerData;
} 

/**
 * Fetches a Lens account using a wallet address via Apollo GraphQL
 * @param address The wallet address to fetch the account for
 * @returns The Lens account if found, null otherwise
 */
export async function fetchAccountByAddress(address: string) {
  if (!address) return null;
  
  try {
    // Format address to lowercase for consistency
    const formattedAddress = address.toLowerCase();
    
    // Use Apollo to fetch profiles by address
    const result = await apolloClient.query({
      query: GET_PROFILES_BY_ADDRESS,
      variables: {
        request: {
          where: {
            ownedBy: [formattedAddress]
          }
        }
      }
    });
    
    const profiles = result.data?.profiles?.items || [];
    
    // If we found profiles, return the first one
    if (profiles.length > 0) {
      const profile = profiles[0];
      
      // Create a new object with cleaned values instead of modifying the original
      const formattedProfile = {
        id: profile.id,
        handle: profile.handle 
          ? {
              fullHandle: profile.handle.fullHandle?.replace('lens/', '') || '',
              localName: profile.handle.localName?.replace('lens/', '') || ''
            }
          : null,
        // Add other properties as needed to match the LensAccount interface
        stats: profile.stats,
        metadata: profile.metadata
      };
      
      return formattedProfile;
    }
    
    // If no profiles found, return null
    return null;
  } catch (error) {
    console.error(`Error fetching Lens account:`, error);
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