import { FollowerNetwork, FollowerNode, RawFollower } from '../types/network';

export async function buildNetwork(
  startingHandle: string,
  getProfileFn: (handle: string) => Promise<{ id: string, picture?: string, followingCount: number, followersCount: number, lensScore: number}>,
  getFollowersFn: (profileId: string) => Promise<RawFollower[]>,
  maxFollowers = 200
): Promise<FollowerNetwork> {
  try {
    // Get starting profile
    const profile = await getProfileFn(startingHandle);
    const startingNode: FollowerNode = {
      id: profile.id,
      name: startingHandle,
      picture: profile.picture || 'default_profile.png',
      followers: profile.followersCount,
      following: profile.followingCount,
      lensScore: profile.lensScore
    };

    const network: FollowerNetwork = {
      nodes: [startingNode],
      links: []
    };

    const nodeIds = new Set<string>([startingNode.id]);
    const linkKeys = new Set<string>();

    // Process queue
    const queue: { id: string; depth: number }[] = [{ id: profile.id, depth: 0 }];
    
    while (queue.length > 0 && network.nodes.length < maxFollowers) {
      const current = queue.shift()!;
      const followers = await getFollowersFn(current.id);

      for (const follower of followers) {
        // Add node if not exists
        if (!nodeIds.has(follower.id)) {
          network.nodes.push({
            id: follower.id,
            name: follower.handle,
            picture: follower.picture,
            followers: follower.followersCount,
            following: follower.followingCount,
            lensScore: follower.lensScore
          });
          nodeIds.add(follower.id);
        }

        // Add link if not exists
        const linkKey = `${follower.following}-${follower.id}`;
        if (!linkKeys.has(linkKey)) {
          network.links.push({
            source: follower.following,
            target: follower.id
          });
          linkKeys.add(linkKey);
        }

        // Add to queue if within depth limit
        if (current.depth < 2 && !queue.some(item => item.id === follower.id)) {
          queue.push({ id: follower.id, depth: current.depth + 1 });
        }
      }
    }

    return network;
  } catch (error) {
    console.error('Error building network:', error);
    throw error;
  }
} 