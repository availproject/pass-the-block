
import { PublicClient, testnet } from "@lens-protocol/client";

// Create the public client
export const client = PublicClient.create({
    environment: testnet,
    origin: typeof window !== 'undefined' ? window.location.origin : 'lenscollective.me',
  });