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

  // Validate the NEXT_PUBLIC_APP_URL 
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Check if the URL is valid - this will throw an error if invalid
  try {
    new URL(appUrl);
    console.log(`App URL is valid: ${appUrl}`);
  } catch (error) {
    console.error(`Invalid NEXT_PUBLIC_APP_URL: ${appUrl}`);
    return NextResponse.json({ 
      error: 'Server configuration error: Invalid App URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }

  // Create a timeout promise with longer timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), 20000); // 20 second timeout (reduced from 30s)
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
      
      // Even if the screenshot process timed out, check if the image was created anyway
      const imagePath = `images/${lensHandle}_network_graph.png`;
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      if (fs.existsSync(fullPath)) {
        console.log("Despite error, image file exists. Returning it.");
        const fileBuffer = fs.readFileSync(fullPath);
        const base64Image = fileBuffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;
        
        return NextResponse.json({
          success: true,
          imageUrl: dataUrl,
          timestamp: new Date().toISOString(),
          note: "Image generated despite timeout"
        });
      }
      
      // Include full error details in the response
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to capture screenshot',
        stack: error instanceof Error ? error.stack : undefined,
        message: 'The screenshot process took too long or encountered an error. Please try again.'
      }, { status: 500 });
  }
}

async function takeScreenshot(lensHandle :string) {
    // Log the environment variables and URL construction
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const targetUrl = `${baseUrl}/screenshot?handle=${lensHandle}`;
    console.log('Environment variables:', {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        calculatedBaseUrl: baseUrl,
        targetUrl: targetUrl,
        lensHandle: lensHandle
    });

    try {
        console.log(`Launching puppeteer browser...`);
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        console.log(`Browser launched, creating new page...`);
        const page = await browser.newPage();
        
        try {
            // Navigate directly to the screenshot page with the handle
            console.log(`Navigating to URL: ${targetUrl}`);
            await page.goto(targetUrl, { 
                waitUntil: 'networkidle2',
                timeout: 15000 // Increased timeout for initial page load
            });
            
            // First check for the ready indicator
            console.log(`Waiting for screenshot-ready-indicator...`);
            await page.waitForSelector('#screenshot-ready-indicator', { 
                timeout: 5000
            }).catch(err => {
                console.log('Ready indicator not found, continuing anyway');
            });
            
            // Wait for the network graph to be visible
            const networkGraphSelector = '#network-graph canvas';
            console.log(`Waiting for selector: ${networkGraphSelector}`);
            await page.waitForSelector(networkGraphSelector, { timeout: 10000 });
            console.log('Network graph canvas element found.');
            
            // Wait for the graph to stabilize
            await sleep(3000);
            console.log('Done waiting for graph stabilization');
            
            // Create public/images directory if it doesn't exist
            await mkdir('./public/images', { recursive: true });
            
            // Take full screenshot
            console.log('Taking full screenshot...');
            await page.screenshot({ path: `./public/images/${lensHandle}_full.png` });
            
            // Get the network graph element and its dimensions
            console.log('Cropping screenshot...');
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
    } catch (error) {
        console.error('Error during screenshot process:', error);
        throw error;
    }
}

// Fallback screenshot function that takes a simpler approach
async function takeFallbackScreenshot(lensHandle: string) {
  // Log the environment variables and URL construction for fallback
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  console.log('Fallback screenshot - Environment variables:', {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    calculatedBaseUrl: baseUrl,
    lensHandle: lensHandle
  });

  let browser;
  try {
    console.log(`Launching fallback puppeteer browser...`);
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    console.log(`Fallback browser launched, creating new page...`);
    const page = await browser.newPage();
    
    console.log(`Navigating to fallback URL: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Wait for the graph to be visible
    console.log(`Waiting for fallback selector: #network-graph`);
    await page.waitForSelector('#network-graph', { timeout: 5000 });
    console.log('Fallback graph found');
    
    // Create public/images directory if it doesn't exist
    await mkdir('./public/images', { recursive: true });
    
    // Take a screenshot of the entire page
    console.log(`Taking fallback screenshot...`);
    await page.screenshot({ path: `./public/images/${lensHandle}_full.png` });
    
    // Crop the image to focus on the graph
    console.log(`Cropping fallback screenshot...`);
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
    if (browser) {
      await browser.close();
    }
  }
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}