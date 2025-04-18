import { FollowerNetwork, FollowerNode, RawFollower } from '../types/network';

export async function buildNetwork(
  startingHandle: string,
  getProfileFn: (handle: string) => Promise<RawFollower>,
  getFollowersFn: (address: string) => Promise<RawFollower[]>,
  maxFollowers = 75
): Promise<FollowerNetwork> {
  try {
    const profile = await getProfileFn(startingHandle);
    const startingNode: FollowerNode = {
      id: profile.id,
      name: profile.name,
      picture: profile.picture || 'default_image.png',
      followers: profile.followers,
      following: profile.following,
      lensScore: profile.lensScore,
      posts: profile.posts,
      lensReputationScore: profile.lensReputationScore,
    };

    const network: FollowerNetwork = {
      nodes: [startingNode],
      links: []
    };

    // Skip follower fetching if the profile has no followers
    if (profile.followers === 0) {
      console.log(`Profile ${startingHandle} has no followers, skipping follower fetch.`);
      return network;
    }

    // Get direct followers
    const followers = await getFollowersFn(profile.address);

    // Add followers to network
    for (const follower of followers) {
      network.nodes.push({
        id: follower.id,
        name: follower.name,
        picture: follower.picture || 'default_image.png',
        followers: follower.followers,
        following: follower.following,
        lensScore: follower.lensScore,
        posts: follower.posts
      });

      // Add link from starting node to follower
      network.links.push({ source: startingNode.id, target: follower.id });
    }

    return network;
  } catch (error) {
    throw error;
  }
} 