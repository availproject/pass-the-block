import { FollowerNetwork, FollowerNode, RawFollower } from '../types/network';

export async function buildNetwork(
  startingHandle: string,
  getProfileFn: (handle: string) => Promise<RawFollower>,
  getFollowersFn: (address: string) => Promise<RawFollower[]>,
  maxFollowers = 150
): Promise<FollowerNetwork> {
  try {
    const profile = await getProfileFn(startingHandle);
    const startingNode: FollowerNode = {
      id: profile.id,
      name: profile.name,
      picture: profile.picture || 'default_profile.png',
      followers: profile.followers,
      following: profile.following,
      lensScore: profile.lensScore
    };

    const network: FollowerNetwork = {
      nodes: [startingNode],
      links: []
    };

    // Get direct followers
    const followers = await getFollowersFn(profile.address);

    // Add followers to network
    for (const follower of followers) {
      network.nodes.push({
        id: follower.id,
        name: follower.name,
        picture: follower.picture || 'default_profile.png',
        followers: follower.followers,
        following: follower.following,
        lensScore: follower.lensScore
      });

      // Add link from starting node to follower
      network.links.push({ source: startingNode.id, target: follower.id });
    }

    return network;
  } catch (error) {
    throw error;
  }
} 