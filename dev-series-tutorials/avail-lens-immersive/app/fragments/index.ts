import type { FragmentOf } from "@lens-protocol/client";

import { AccountFragment, AccountMetadataFragment } from "./accounts";
import { PostFragment, PostMetadataFragment } from "./posts";
import { MediaImageFragment } from "./images";

declare module "@lens-protocol/client" {
  export interface Account extends FragmentOf<typeof AccountFragment> {}
  export interface AccountMetadata extends FragmentOf<typeof AccountMetadataFragment> {}
  export interface MediaImage extends FragmentOf<typeof MediaImageFragment> {}
  export interface Post extends FragmentOf<typeof PostFragment> {}
  export type PostMetadata = FragmentOf<typeof PostMetadataFragment>;
}

export const fragments = [
  AccountFragment,
  AccountMetadataFragment,
  PostFragment,
  PostMetadataFragment,
  MediaImageFragment,
]; 