import { graphql } from "@lens-protocol/client";

export const MediaImageFragment = graphql(`
  fragment MediaImage on ImageSet {
    optimized {
      uri
      mimeType
    }
    transformed(request: { fixedSize: { height: 128, width: 128 } }) {
      uri
      mimeType
    }
  }
`); 