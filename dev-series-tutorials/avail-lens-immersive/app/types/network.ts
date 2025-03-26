export interface FollowerNode {
  id: string;
  name: string;
  picture: string;
  followers: number;
  following: number;
  lensScore: number;
}

export interface FollowerLink {
  source: string;
  target: string;
}

export interface FollowerNetwork {
  nodes: FollowerNode[];
  links: FollowerLink[];
}

export interface RawFollower {
  id: string;
  handle: string;
  picture: string;
  following: string;
  followersCount: number;
  followingCount: number;
  lensScore: number;
} 