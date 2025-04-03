import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { RawFollower } from '../types/network';
import { evmAddress, PublicClient, mainnet  } from '@lens-protocol/client';
import { fetchAccountsAvailable } from '@lens-protocol/client/actions';

// Initialize Apollo Client
const apolloClient = new ApolloClient({
  uri: 'https://api-v2.lens.dev/',
  cache: new InMemoryCache()
});

// GraphQL Queries
const PROFILE_METADATA = gql`
  query Profile($request: ProfileRequest!) {
    profile(request: $request) {
      metadata {
        picture {
          ... on ImageSet {
            optimized {
              uri
            }
          }
        }
      }
      id
      stats {
        followers
        following
        lensClassifierScore
      }
    }
  }
`;

const GET_FOLLOWER_DETAILS = gql`
  query Followers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        handle {
          fullHandle
          localName
        }
        id
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

export async function getProfileMetadata(lensHandle: string) {
  const result = await apolloClient.query({
    query: PROFILE_METADATA,
    variables: { request: { forHandle: lensHandle } }
  });
  
  return {
    id: result.data.profile.id,
    picture: result.data.profile.metadata?.picture?.optimized?.uri,
    followersCount: result.data.profile.stats.followers,
    followingCount: result.data.profile.stats.following,
    lensScore: result.data.profile.stats.lensClassifierScore
  };
}

export async function getFollowerDetails(profileId: string): Promise<RawFollower[]> {
  const result = await apolloClient.query({
    query: GET_FOLLOWER_DETAILS,
    variables: {
      request: {
        orderBy: "PROFILE_CLASSIFIER",
        of: profileId,
        limit: "Ten"
      }
    }
  });

  return result.data.followers.items.map((follower: any) => ({
    id: follower.id,
    handle: follower.handle?.fullHandle || follower.handle?.localName || `user_${follower.id}`,
    picture: follower.metadata?.picture?.optimized?.uri || "default_image.png",
    following: profileId,
    followersCount: follower.stats.followers,
    followingCount: follower.stats.following,
    lensScore: follower.stats.lensClassifierScore
  }));
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