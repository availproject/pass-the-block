import { client } from "../types/lens";
import { evmAddress, uri } from '@lens-protocol/client';
import { post } from '@lens-protocol/client/actions';
import { StorageClient } from "@lens-chain/storage-client";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import { BrowserProvider, chains } from "@lens-chain/sdk/ethers";
import { Eip1193Provider } from "ethers";
import {
  image,
  textOnly,
  MediaImageMimeType,
  MetadataLicenseType,
} from "@lens-protocol/metadata";

// Function to authenticate a user when they want to post
export async function authenticateForPosting(
  walletAddress: string,
  signMessage: (message: string) => Promise<string>,
  lensProfileId?: string
) {
  try {
    console.log("Starting Lens authentication process for wallet:", walletAddress);
    
    // Format the wallet address correctly for Lens
    let formattedAddress;
    try {
      formattedAddress = evmAddress(walletAddress);
      console.log("Address formatted for Lens:", formattedAddress);
    } catch (formatError) {
      console.error("Error formatting wallet address:", formatError);
      return { 
        success: false, 
        error: new Error(`Invalid wallet address format: ${walletAddress}`) 
      };
    }
    
    // Create a function that will sign messages
    const signMessageFn = async (message: string) => {
      console.log("Signing message for authentication");
      const signature = await signMessage(message);
      console.log("Message signed successfully");
      return signature;
    };

    // If we have a Lens profile ID, use the account manager flow first
    if (lensProfileId) {
      console.log("Attempting authentication with account manager flow using profile ID:", lensProfileId);
      try {
        const authenticatedWithManager = await client.login({
          accountOwner: {
            account: lensProfileId, // Use the Lens profile ID
            app: "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE", // Mainnet Test App
            owner: formattedAddress, // Use the wallet address as the manager
          },
          signMessage: signMessageFn,
        });
        
        if (!authenticatedWithManager.isErr()) {
          console.log("Authentication with account manager successful");
          return { 
            success: true, 
            sessionClient: authenticatedWithManager.value 
          };
        }
        
        console.error('Account manager authentication failed:', authenticatedWithManager.error);
      } catch (managerError) {
        console.error("Error in account manager flow:", managerError);
      }
    }

    // If account manager approach fails or no profile ID, try the account owner approach
    console.log("Attempting authentication with account owner flow");
    try {
      const authenticated = await client.login({
        accountOwner: {
          account: formattedAddress,
          app: "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE", // Mainnet Test App
          owner: formattedAddress,
        },
        signMessage: signMessageFn,
      });
      
      if (!authenticated.isErr()) {
        console.log("Authentication with account owner successful");
        return { 
          success: true, 
          sessionClient: authenticated.value 
        };
      }
      
      console.error('Account owner authentication failed:', authenticated.error);
    } catch (ownerError) {
      console.error("Error in account owner flow:", ownerError);
    }
    
    // If both approaches failed, try one more time with the account manager flow using the wallet address for both
    if (!lensProfileId) {
      console.log("Attempting fallback authentication with account manager using wallet address for both fields");
      try {
        const fallbackAuth = await client.login({
          accountManager: {
            account: formattedAddress, // Use wallet address as a fallback
            app: "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE", // Mainnet Test App
            manager: formattedAddress,
          },
          signMessage: signMessageFn,
        });
        
        if (!fallbackAuth.isErr()) {
          console.log("Fallback authentication successful");
          return { 
            success: true, 
            sessionClient: fallbackAuth.value 
          };
        }
        
        console.error('Fallback authentication failed:', fallbackAuth.error);
      } catch (fallbackError) {
        console.error("Error in fallback authentication:", fallbackError);
      }
    }

    return { 
      success: false, 
      error: new Error("Failed to authenticate with all available methods") 
    };
  } catch (error) {
    console.error('Error authenticating with Lens:', error);
    return { 
      success: false, 
      error 
    };
  }
}

// Function to post content to Lens once authenticated
export async function postToLens(
  sessionClient: any, 
  content: string,
  imageUrl?: string,
  lensHandle?: string
) {
  try {
    console.log("🚀 Starting post to Lens process");
    console.log("📝 Content:", content);
    
    // Log sessionClient details (safely)
    console.log("👤 Session client available:", !!sessionClient);
    console.log("👤 Session client structure:", Object.keys(sessionClient));
    
    if (sessionClient?.authentication) {
      console.log("🔐 Authentication type:", 
        sessionClient.authentication.accountOwner ? "accountOwner" : 
        sessionClient.authentication.accountManager ? "accountManager" : "unknown");
    }
    
    // STEP 1: Create post metadata using the official Lens metadata helpers
    console.log("📋 Step 1: Creating post metadata");
    let metadata;
    
    if (imageUrl) {
      
      // Use the lens handle provided directly, or fallback to extracting from content
      const useLensHandle = lensHandle || content.match(/for\s+(lens\/\w+|@\w+)/i)?.[1]?.replace('@', '') || 'availproject';
      const cleanHandle = useLensHandle.replace('lens/', '');
      
      // Construct the public URL using the app's base URL
      const baseUrl = 'https://lenscollective.me';
      let publicImageUrl = `${baseUrl}/images/${cleanHandle}_se_social_card.png`;
      
      console.log("💡 Using public image URL instead of base64:", publicImageUrl);
      
      // Create metadata that conforms to the Lens schema
      metadata = {
        "$schema": "https://json-schemas.lens.dev/posts/image/3.0.0.json",
        "lens": {
          "id": crypto.randomUUID(),
          "locale": "en",
          "mainContentFocus": "IMAGE",
          "content": content,
          "image": {
            "item": publicImageUrl,
            "type": MediaImageMimeType.PNG,
            "altTag": "Network visualization from Lens Visualization Tool by Avail Project",
          },
          "tags": ["visualization", "network", "avail"]
        },
        "name": "Lens Visualization by Avail Project",
        "description": content
      };
      
      console.log("📊 Simplified metadata:", JSON.stringify(metadata, null, 2));
    } else {
      // Simple text-only metadata
      metadata = {
        "$schema": "https://json-schemas.lens.dev/posts/text-only/3.0.0.json",
        "lens": {
          "id": crypto.randomUUID(),
          "content": content,
          "locale": "en",
          "mainContentFocus": "TEXT_ONLY"
        }
      };
    }
    
    console.log("📊 Created metadata:", JSON.stringify(metadata, null, 2));
    
    // STEP 2: Upload metadata to get a contentUri using StorageClient
    console.log("📤 Step 2: Uploading metadata using StorageClient");
    
    // Create a storage client instance
    const storageClient = StorageClient.create();
    console.log("🗂️ Storage client created");

    // Extract authentication info if available
    let profileId = null;
    if (sessionClient.authentication?.accountOwner?.account) {
      profileId = sessionClient.authentication.accountOwner.account;
      console.log("👤 Using profile ID for storage:", profileId);
    } else if (sessionClient.authentication?.accountManager?.account) {
      profileId = sessionClient.authentication.accountManager.account;
      console.log("👤 Using profile ID for storage:", profileId);
    }
    
    // Upload the metadata
    console.log("📤 Uploading metadata...");
    const { uri: contentURI } = await storageClient.uploadAsJson(metadata);
    console.log("🔗 Metadata uploaded, received contentURI:", contentURI);
    
    if (!contentURI) {
      throw new Error("Failed to upload metadata: No contentURI returned");
    }
    
    // STEP 3: Create the post with the contentUri using the post action
    console.log("📝 Step 3: Creating post with contentURI");
    console.log("🔄 Using @lens-protocol/client/actions post method");
    
    try {
      // Create a contentURI param with the uri function
      const contentUriParam = uri(contentURI);
      console.log("📝 Content URI param created:", contentUriParam);

      // Initialize ethers provider and signer
      console.log("Initializing ethers provider");
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      console.log("Provider created:", !!provider);
      
      const signer = await provider.getSigner();
      console.log("Signer created:", !!signer);
      console.log("Signer address:", await signer.getAddress());
      
      // Use the post action with ethers signer
      console.log("🔄 Calling post method with ethers signer...");
      
      console.log("💼 Preparing to handle post operation");
      const result = await post(sessionClient, { contentUri: contentUriParam })
        .andThen(handleOperationWith(signer))  
        .andThen(sessionClient.waitForTransaction);

      
      console.log("📨 Post result:", result);
      
      // Success - if we got here, the post was successful
      console.log("🎉 Post created successfully!");
      return {
        success: true,
        txId: result.isOk() ? result.value || 'transaction-id' : 'transaction-failed'
      };
    } catch (postError) {
      console.error("❌ Error using post action:", postError);
      console.error("Error details:", JSON.stringify(postError, null, 2));
      throw postError; // Rethrow to handle in the calling function
    }
    
  } catch (error) {
    console.error('❌ Unhandled error posting to Lens:', error);
    // Additional error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', typeof error);
    }
    return { 
      success: false, 
      error 
    };
  }
} 