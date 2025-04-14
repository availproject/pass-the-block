import { NextRequest, NextResponse } from 'next/server';
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";

let browser: any = null;

async function getBrowser() {
  if (browser) return browser;

  const isProd = process.env.NODE_ENV === 'production';
  console.log('Environment:', process.env.NODE_ENV);

  if (isProd) {
    // Use chromium-min in production (Vercel)
    console.log('Using chromium-min in production');
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1280,
        height: 1280,
      },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Use regular puppeteer in development
    console.log('Using regular puppeteer in development');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: {
        width: 1280,
        height: 1280,
      },
      headless: true,
    });
  }
  
  return browser;
}

export async function GET(req: NextRequest) {
  console.log('Requesting Screenshot');
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
    return NextResponse.json(
      {
        error: 'Server configuration error: Invalid App URL',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }

  let currentBrowser = null;
  try {
    const targetUrl = `${appUrl}/screenshot?handle=${lensHandle}`;
    console.log(`Taking screenshot of: ${targetUrl}`);
    
    currentBrowser = await getBrowser();
    const page = await currentBrowser.newPage();
    
    // Navigate to the page
    console.log('Navigating to page...');
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    // Wait for the network graph to be visible
    console.log('Waiting for network graph...');
    await page.waitForSelector('#network-graph canvas', { timeout: 10000 });
    
    // Wait for graph stabilization
    console.log('Waiting for graph stabilization...');
    await sleep(5000);
    
    // Take screenshot of the network graph container
    console.log('Taking screenshot...');
    const networkGraphElement = await page.$('#network-graph');
    if (!networkGraphElement) {
      throw new Error('Network graph element not found');
    }
    
    const screenshotBuffer = await networkGraphElement.screenshot({
      type: 'png',
      omitBackground: false,
    });
    
    console.log('Screenshot taken successfully');
    await page.close();
    
    // Convert buffer to base64
    const base64Image = Buffer.from(screenshotBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    
    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to capture screenshot',
        stack: error instanceof Error ? error.stack : undefined,
        message: 'The screenshot process encountered an error. Please try again.',
      },
      { status: 500 }
    );
  } finally {
    if (currentBrowser) {
      try {
        await currentBrowser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}