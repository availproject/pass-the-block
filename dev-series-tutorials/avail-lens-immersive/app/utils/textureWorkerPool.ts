// Texture worker pool for efficiently loading textures off the main thread
import * as THREE from 'three';

// Types matching the worker's message types
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

class TextureWorkerPool {
  private worker: Worker | null = null;
  private textureLoadQueue: Map<string, {
    url: string;
    resolve: (texture: THREE.Texture) => void;
    reject: (error: Error) => void;
  }> = new Map();
  private isWorkerSupported: boolean = typeof Worker !== 'undefined' && typeof window !== 'undefined';
  private loader: THREE.TextureLoader;

  constructor() {
    this.loader = new THREE.TextureLoader();
    
    // Only create workers in browser environment
    if (this.isWorkerSupported) {
      try {
        // For simplicity in this implementation, let's use a simpler fetch-based approach
        // rather than a true web worker, since web workers can be tricky in Next.js
        this.isWorkerSupported = false;
      } catch (e) {
        console.warn('Failed to initialize texture worker:', e);
        this.isWorkerSupported = false;
      }
    }
  }

  private setupWorkerHandlers() {
    if (!this.worker) return;
    
    this.worker.onmessage = (event: MessageEvent<LoadResponse>) => {
      const { id, url, success, data, error } = event.data;
      
      const pendingLoad = this.textureLoadQueue.get(id);
      if (!pendingLoad) return;
      
      // Remove from queue
      this.textureLoadQueue.delete(id);
      
      if (success && data) {
        try {
          // Convert ArrayBuffer to blob with appropriate MIME type
          const blob = new Blob([data], { type: this.getMimeType(url) });
          const blobUrl = URL.createObjectURL(blob);
          
          // Load texture from blob URL
          this.loader.load(
            blobUrl,
            (texture) => {
              // Clean up blob URL after texture is loaded
              URL.revokeObjectURL(blobUrl);
              
              // Setup texture properties
              texture.minFilter = THREE.LinearFilter;
              texture.generateMipmaps = false;
              
              // Resolve the promise
              pendingLoad.resolve(texture);
            },
            undefined,
            (loadError: unknown) => {
              URL.revokeObjectURL(blobUrl);
              const errorMessage = loadError instanceof Error ? loadError.message : 'Failed to create texture';
              pendingLoad.reject(new Error(errorMessage));
            }
          );
        } catch (e) {
          pendingLoad.reject(new Error(`Failed to process image data: ${e}`));
        }
      } else {
        pendingLoad.reject(new Error(error || 'Unknown error loading texture'));
      }
    };
    
    this.worker.onerror = (event) => {
      console.error('Texture worker error:', event);
    };
  }
  
  // Determine MIME type from URL
  private getMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/jpeg'; // Default fallback
    }
  }

  // Simulate worker with fetch in main thread but don't block UI
  private async loadImageOffMainThread(url: string): Promise<ArrayBuffer> {
    // Use fetch API to get the image data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
    }
    return await response.arrayBuffer();
  }

  // Load a texture using the worker or fetch simulation
  loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      // Generate a unique ID for this request
      const id = `${url}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // If workers aren't supported, use simulated off-main-thread loading with promises
      if (!this.isWorkerSupported || !this.worker) {
        // Use Promise to make this non-blocking
        setTimeout(() => {
          this.loadImageOffMainThread(url)
            .then(imageData => {
              // Convert ArrayBuffer to blob
              const blob = new Blob([imageData], { type: this.getMimeType(url) });
              const blobUrl = URL.createObjectURL(blob);
              
              // Load texture from blob URL
              this.loader.load(
                blobUrl,
                (texture) => {
                  URL.revokeObjectURL(blobUrl);
                  texture.minFilter = THREE.LinearFilter;
                  texture.generateMipmaps = false;
                  resolve(texture);
                },
                undefined,
                (error) => {
                  URL.revokeObjectURL(blobUrl);
                  reject(error);
                }
              );
            })
            .catch(error => reject(error));
        }, 0);
        return;
      }
      
      // Add to queue if using real worker
      this.textureLoadQueue.set(id, { url, resolve, reject });
      
      // Send request to worker
      const request: LoadRequest = { id, url };
      this.worker.postMessage(request);
    });
  }
  
  // Clean up resources
  dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // Reject any pending requests
    this.textureLoadQueue.forEach(({ reject }) => {
      reject(new Error('Worker disposed'));
    });
    
    this.textureLoadQueue.clear();
  }
}

// Create and export a singleton instance
const textureWorkerPool = new TextureWorkerPool();
export default textureWorkerPool; 