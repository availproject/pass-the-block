'use server';

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
console.log("Requesting Screenshot")
  const { searchParams } = new URL(req.url);
  const lensHandle = searchParams.get('handle');

  if (!lensHandle) {
      return NextResponse.json({ error: 'Lens handle is required' }, { status: 400 });
  }

  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), 15000); // 15 second timeout
  });

  try {
      console.log("Taking Screenshot...")  
      
      // Race between the screenshot and the timeout
      await Promise.race([
        takeScreenshot(lensHandle),
        timeoutPromise
      ]);
     
       // 2. Verify the image exists
      const imagePath = `images/${lensHandle}_network_graph.png`;
      const fullPath = path.join(process.cwd(), 'public', imagePath);

      if (!fs.existsSync(fullPath)) {
        // If the image doesn't exist, try to take a fallback screenshot
        console.log("Image not found, trying fallback screenshot...");
        await takeFallbackScreenshot(lensHandle);
        
        // Check again if the image exists
        if (!fs.existsSync(fullPath)) {
          return NextResponse.json(
            { error: 'Graph image not found' },
            { status: 404 }
          );
        }
      }

      // Read image and convert to base64
      const fileBuffer = fs.readFileSync(fullPath);
      const base64Image = fileBuffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;


        return NextResponse.json({
          success: true,
          imageUrl: dataUrl,
          timestamp: new Date().toISOString()
        });
    

  } catch (error) {
      console.error('Error taking screenshot:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to capture screenshot',
        message: 'The screenshot process took too long or encountered an error. Please try again.'
      }, { status: 500 });
  }
}

async function takeScreenshot(lensHandle :string) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate directly to the screenshot page with the handle
        await page.goto(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/screenshot?handle=${lensHandle}`, { 
            waitUntil: 'networkidle2' 
        });
        
        // Wait for the network graph to be visible
        const networkGraphSelector = '#network-graph canvas';
        await page.waitForSelector(networkGraphSelector, { timeout: 5000 });
        console.log('Network graph loaded.');
        
        // Wait for profile images to load with a more robust check
        console.log('Waiting for profile images to load...');
        await page.waitForFunction(() => {
            // Check all images in the graph
            const images = document.querySelectorAll('#network-graph img');
            if (images.length === 0) return false;
            
            // Check if all images are loaded and have valid dimensions
            return Array.from(images).every((img) => {
                const imageElement = img as HTMLImageElement;
                return imageElement.complete && 
                       imageElement.naturalWidth > 0 && 
                       imageElement.naturalHeight > 0 &&
                       (imageElement.src.startsWith('data:image') || imageElement.src.includes('profile-picture'));
            });
        }, { timeout: 10000 }).catch((error) => {
            console.log('Some images may not have loaded properly:', error.message);
        });
        
        // Additional wait to ensure images are rendered
        await sleep(2000);
        
        // Create public/images directory if it doesn't exist
        await mkdir('./public/images', { recursive: true });
        
        // Take full screenshot
        await page.screenshot({ path: `./public/images/${lensHandle}_full.png` });
        
        // Get the network graph element and its dimensions
        const clip = await page.$eval('#network-graph', el => {
            const { x, y, width, height } = el.getBoundingClientRect();
            const size = Math.min(width, height) * 0.8;
            const left = x + (width - size) / 2;
            const top = y + 100;
            return {
                left: Math.floor(left),
                top: Math.floor(top),
                width: Math.floor(size),
                height: Math.floor(size)
            };
        });
        
        // Crop and save the network graph
        await sharp(`./public/images/${lensHandle}_full.png`)
            .extract(clip)
            .toFile(`./public/images/${lensHandle}_network_graph.png`);
        
        console.log(`Graph stored to ./public/images/${lensHandle}_network_graph.png`);
        
        await browser.close();
    } catch (error) {
        console.error('Error during screenshot process:', error);
        await browser.close();
        throw error;
    }
}

// Fallback screenshot function that takes a simpler approach
async function takeFallbackScreenshot(lensHandle: string) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for the graph to be visible
    await page.waitForSelector('#network-graph', { timeout: 5000 });
    
    // Create public/images directory if it doesn't exist
    await mkdir('./public/images', { recursive: true });
    
    // Take a screenshot of the entire page
    await page.screenshot({ path: `./public/images/${lensHandle}_full.png` });
    
    // Crop the image to focus on the graph
    const clip = await page.$eval('#network-graph', el => {
      const { x, y, width, height } = el.getBoundingClientRect();
      const size = Math.min(width, height) * 0.8;
      const left = x + (width - size) / 2;
      const top = y + 100;
      return {
        left: Math.floor(left),
        top: Math.floor(top),
        width: Math.floor(size),
        height: Math.floor(size)
      };
    });
    
    await sharp(`./public/images/${lensHandle}_full.png`)
      .extract(clip)
      .toFile(`./public/images/${lensHandle}_network_graph.png`);
    
    console.log(`Fallback graph stored to ./public/images/${lensHandle}_network_graph.png`);
  } catch (error) {
    console.error('Error taking fallback screenshot:', error);
  } finally {
    await browser.close();
  }
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}