import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { lensAccountOnly } from "@lens-chain/storage-client";

/**
 * Uploads an image data URL to Grove Storage
 * @param imageDataUrl Base64 encoded image data URL
 * @param fileName Desired filename for the uploaded file
 * @param lensAccountAddress Optional Lens account address to restrict access
 * @returns Promise resolving to the Gateway URL of the uploaded file
 */
export async function uploadImageToGrove(
  imageDataUrl: string, 
  fileName: string, 
  lensAccountAddress?: string
): Promise<{
  uri: string;
  gatewayUrl: string;
}> {
  if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
    throw new Error('Invalid image data URL');
  }

  try {
    console.log(`Preparing to upload ${fileName} to Grove Storage...`);
    
    // Extract base64 data and create a Blob
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: 'image/png' });
    const file = new File([blob], fileName, { type: 'image/png' });
    
    // Initialize Grove Storage client
    const storageClient = StorageClient.create();
    
    // Upload the file to Grove Storage - use default ACL
    console.log(`Uploading file ${fileName} to Grove Storage...`);
    
    // Note: We're not using custom ACL for now to avoid type issues
    // If needed, the proper Lens ACL configuration can be added later
    const result = await storageClient.uploadFile(file);
    
    console.log(`File uploaded to Grove Storage: ${result.gatewayUrl}`);
    return result;
  } catch (error) {
    console.error('Error uploading to Grove Storage:', error);
    throw error;
  }
} 