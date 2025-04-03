import { UsernameFragment, graphql } from "@lens-protocol/client";
import { MediaImageFragment } from "./images";

export const AccountMetadataFragment = graphql(
  `
    fragment AccountMetadata on AccountMetadata {
      name
      bio

      thumbnail: picture(
        request: { preferTransform: { fixedSize: { height: 128, width: 128 } } }
      ) {
        ...MediaImage
      }
      picture {
        ...MediaImage
      }
    }
  `,
  [MediaImageFragment]
);

export const AccountFragment = graphql(
  `
    fragment Account on Account {
      __typename
      username {
        ...Username
      }
      address
      metadata {
        ...AccountMetadata
      }
      stats {
        followers
        following
      }
    }
  `,
  [UsernameFragment, AccountMetadataFragment]
); 