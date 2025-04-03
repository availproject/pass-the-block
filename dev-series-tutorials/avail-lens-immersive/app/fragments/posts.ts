import { graphql } from "@lens-protocol/client";
import { MediaImageFragment } from "./images";

export const PostMetadataFragment = graphql(
  `
    fragment PostMetadata on PostMetadata {
      content
      contentWarning
      tags
      locale
      mainContentFocus
      image {
        ...MediaImage
      }
    }
  `,
  [MediaImageFragment]
);

export const PostFragment = graphql(
  `
    fragment Post on Post {
      id
      createdAt
      by {
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
      }
      stats {
        reactions
        comments
        mirrors
        quotes
      }
      metadata {
        ...PostMetadata
      }
    }
  `,
  [PostMetadataFragment]
); 