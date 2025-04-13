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

// Internal type for processing, includes address needed for API calls
export interface RawFollower {
  id: string;
  name: string;
  picture: string;
  followers: number;
  following: number;
  lensScore: number;
  address: string; // Keep address for internal use
} 