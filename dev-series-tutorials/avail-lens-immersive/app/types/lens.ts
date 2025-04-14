
import { PublicClient, mainnet } from "@lens-protocol/client";

// Create the public client
export const client = PublicClient.create({
    environment: mainnet,
    origin: typeof window !== 'undefined' ? window.location.origin : 'lenscollective.me',
  });