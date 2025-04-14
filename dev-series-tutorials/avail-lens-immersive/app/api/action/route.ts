'use server';

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

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
    setTimeout(() => reject(new Error('Request timed out')), 20000); // 20 second timeout
  });

  try {
    console.log("Taking Screenshot...")  
    
    // Race between the screenshot and the timeout
    const imageBuffer = await Promise.race([
      takeScreenshot(lensHandle),
      timeoutPromise
    ]) as Buffer;
    
    if (!imageBuffer || imageBuffer.length === 0) {
      console.log("No image generated, trying fallback...");
      const fallbackBuffer = await takeFallbackScreenshot(lensHandle);
      
      if (!fallbackBuffer || fallbackBuffer.length === 0) {
        return NextResponse.json(
          { error: 'Failed to generate graph image' },
          { status: 500 }
        );
      }
      
      // Convert fallback buffer to base64
      const base64Image = fallbackBuffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      return NextResponse.json({
        success: true,
        imageUrl: dataUrl,
        timestamp: new Date().toISOString(),
        note: "Used fallback screenshot method"
      });
    }
    
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    
    // Try fallback one more time
    try {
      console.log("Error occurred, trying fallback screenshot...");
      const fallbackBuffer = await takeFallbackScreenshot(lensHandle);
      
      if (fallbackBuffer && fallbackBuffer.length > 0) {
        const base64Image = fallbackBuffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;
        
        return NextResponse.json({
          success: true,
          imageUrl: dataUrl,
          timestamp: new Date().toISOString(),
          note: "Used fallback after error"
        });
      }
    } catch (fallbackError) {
      console.error('Fallback screenshot also failed:', fallbackError);
    }
    
    // Include full error details in the response
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to capture screenshot',
      stack: error instanceof Error ? error.stack : undefined,
      message: 'The screenshot process took too long or encountered an error. Please try again.'
    }, { status: 500 });
  }
}

async function takeScreenshot(lensHandle: string): Promise<Buffer> {
    // Log the environment variables and URL construction
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const targetUrl = `${baseUrl}/screenshot?handle=${lensHandle}`;
    console.log('Environment variables:', {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        calculatedBaseUrl: baseUrl,
        targetUrl: targetUrl,
        lensHandle: lensHandle
    });

    let browser;
    try {
        console.log(`Launching puppeteer browser...`);
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: { width: 1280, height: 1280 }, // Square viewport for better capture
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        
        console.log(`Browser launched, creating new page...`);
        const page = await browser.newPage();
        
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
        await sleep(5000); // Extended stabilization time for full view
        console.log('Done waiting for graph stabilization');
        
        // Take screenshot of the network graph div (which contains the canvas)
        console.log('Taking screenshot of the network graph...');
        
        // Get the network graph container
        const networkGraphElement = await page.$('#network-graph');
        if (!networkGraphElement) {
            throw new Error('Network graph element not found');
        }
        
        // Take screenshot of the network graph container
        const screenshotBuffer = await networkGraphElement.screenshot({
            type: 'png',
            omitBackground: false
        });
        
        console.log(`Network graph screenshot taken successfully`);
        
        await browser.close();
        return Buffer.from(screenshotBuffer);
    } catch (error) {
        console.error('Error during screenshot process:', error);
        if (browser) await browser.close();
        throw error;
    }
}

// Fallback screenshot function that takes a simpler approach
async function takeFallbackScreenshot(lensHandle: string): Promise<Buffer> {
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
      defaultViewport: { width: 1280, height: 1280 }, // Square viewport for better capture
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    console.log(`Fallback browser launched, creating new page...`);
    const page = await browser.newPage();
    
    console.log(`Navigating to fallback URL: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Wait for the graph container to be visible
    console.log(`Waiting for fallback selector: #network-graph`);
    await page.waitForSelector('#network-graph', { timeout: 5000 });
    console.log('Fallback graph container found');
    
    // Wait for the canvas to be visible
    await page.waitForSelector('#network-graph canvas', { timeout: 5000 });
    console.log('Fallback canvas found');
    
    // Wait for a moment to let the graph render properly
    await sleep(5000);
    
    // Take screenshot of the network graph container
    console.log(`Taking fallback screenshot...`);
    const networkGraphElement = await page.$('#network-graph');
    if (!networkGraphElement) {
        throw new Error('Network graph element not found in fallback');
    }
    
    const screenshotBuffer = await networkGraphElement.screenshot({
        type: 'png',
        omitBackground: false
    });
    
    console.log(`Fallback screenshot taken successfully`);
    await browser.close();
    return Buffer.from(screenshotBuffer);
  } catch (error) {
    console.error('Error taking fallback screenshot:', error);
    if (browser) await browser.close();
    throw error;
  }
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}