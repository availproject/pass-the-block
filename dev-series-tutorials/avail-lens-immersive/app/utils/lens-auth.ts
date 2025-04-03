import { client } from "../types/lens";

// Function to authenticate a user when they want to post
export async function authenticateForPosting(
  walletAddress: string,
  signMessage: (message: string) => Promise<string>
) {
  try {
    // Create a function that will sign messages
    const signMessageFn = async (message: string) => {
      return await signMessage(message);
    };

    // Follow the example provided
    const authenticated = await client.login({
      accountOwner: {
        account: walletAddress,
        app: "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE", // Mainnet Test App
        owner: walletAddress,
      },
      signMessage: signMessageFn,
    });

    if (authenticated.isErr()) {
      console.error('Authentication failed:', authenticated.error);
      return { success: false, error: authenticated.error };
    }

    // Return the authenticated session client
    return { 
      success: true, 
      sessionClient: authenticated.value 
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
  imageUrl?: string
) {
  try {
    // Create the post parameters
    const postParams: any = {
      content,
      contentFocus: imageUrl ? 'IMAGE' : 'TEXT',
      locale: 'en',
    };

    // Add image if provided
    if (imageUrl) {
      postParams.image = {
        url: imageUrl,
        mimeType: 'image/png',
        altTag: 'Network visualization from Lens Visualization Tool',
      };
    }

    // Create the post using the session client
    // The exact API will depend on the specific version of the Lens SDK
    const result = await sessionClient.publication.post(postParams);

    // Handle the result
    if ('isErr' in result && result.isErr()) {
      console.error('Error posting to Lens:', result.error);
      return { 
        success: false, 
        error: result.error 
      };
    }

    // Extract the transaction ID based on the SDK response structure
    const txId = result.value?.id || 'transaction-id';
    
    return {
      success: true,
      txId
    };
  } catch (error) {
    console.error('Error posting to Lens:', error);
    return { 
      success: false, 
      error 
    };
  }
} 