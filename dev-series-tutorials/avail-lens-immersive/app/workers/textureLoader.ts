// Web worker for loading textures
// This worker receives image URLs and loads them using fetch
// It then returns the loaded image data as an ArrayBuffer

// Define types for messages
type LoadRequest = {
  id: string;
  url: string;
};

type LoadResponse = {
  id: string;
  url: string;
  success: boolean;
  data?: ArrayBuffer;
  error?: string;
};

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<LoadRequest>) => {
  const { id, url } = event.data;
  
  try {
    // Fetch the image
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image data as ArrayBuffer
    const imageData = await response.arrayBuffer();
    
    // Send success response back to main thread
    const result: LoadResponse = {
      id,
      url,
      success: true,
      data: imageData
    };
    
    // Use transferable objects to efficiently transfer the ArrayBuffer
    self.postMessage(result, [imageData]);
  } catch (error) {
    // Send error response back to main thread
    const result: LoadResponse = {
      id,
      url,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    self.postMessage(result);
  }
};

// Make TypeScript happy with worker types
declare const self: Worker;
export {}; 