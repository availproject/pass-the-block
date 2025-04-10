import { FollowerNetwork, FollowerNode, RawFollower } from '../types/network';

export async function buildNetwork(
  startingHandle: string,
  getProfileFn: (handle: string) => Promise<RawFollower>,
  getFollowersFn: (address: string) => Promise<RawFollower[]>,
  maxFollowers = 200
): Promise<FollowerNetwork>  {
  try {
    // Get starting profile
    const profile = await getProfileFn(startingHandle);
    const startingNode: FollowerNode = {
      id: profile.id,
      address: profile.address,
      name: profile.name,
      handle: profile.handle,
      fullHandle: profile.fullHandle,
      picture: profile.picture || 'default_profile.png',
      lensScore: profile.lensScore,
      posts: profile.posts,
      tips: profile.tips,
      collects: profile.collects,
      followers: profile.followers,
      following: profile.following
    };

    const network: FollowerNetwork = {
      nodes: [startingNode],
      links: []
    };

    const nodeIds = new Set<string>([startingNode.id]);
    const linkKeys = new Set<string>();

    // Process queue
    const queue: { id: string; address: string; depth: number }[] = [{ id: profile.id, address: profile.address, depth: 0 }];
    
    while (queue.length > 0 && network.nodes.length < maxFollowers) {
      const current = queue.shift()!;
      const followers = await getFollowersFn(current.address);

      for (const follower of followers) {
        // Add node if not exists
        if (!nodeIds.has(follower.id)) {
          network.nodes.push({
            id: follower.id,
            address: follower.address,
            name: follower.name,
            handle: follower.handle,
            fullHandle: follower.fullHandle,
            picture: follower.picture || 'default_profile.png',
            lensScore: follower.lensScore,
            posts: follower.posts,
            tips: follower.tips,
            collects: follower.collects,
            followers: follower.followers,
            following: follower.following
          });
          nodeIds.add(follower.id);
        }

        // Add link if not exists
        const linkKey = `${current.id}-${follower.id}`;
        if (!linkKeys.has(linkKey)) {
          network.links.push({
            source: current.id,
            target: follower.id
          });
          linkKeys.add(linkKey);
        }

        // Add to queue if within depth limit
        if (current.depth < 2 && !queue.some(item => item.id === follower.id)) {
          queue.push({ id: follower.id, address: follower.address, depth: current.depth + 1 });
        }
      }
    }

    return network;
  } catch (error) {
    console.error('Error building network:', error);
    throw error;
  }
} 