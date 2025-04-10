export interface FollowerNode {
  id: string;
  address: string;
  name?: string;
  handle: string;
  fullHandle: string;
  picture?: string;
  lensScore: number;
  posts: number;
  tips: number;
  collects: number;
  followers: number;
  following: number;
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
  address: string;
  name?: string;
  handle: string;
  fullHandle: string;
  picture?: string;
  lensScore: number;
  posts: number;
  tips: number;
  collects: number;
  followers: number;
  following: number;
} 