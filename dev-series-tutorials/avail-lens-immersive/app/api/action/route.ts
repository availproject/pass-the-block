'use server';

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
console.log("Requesting Screenshot")
  const { searchParams } = new URL(req.url);
  const lensHandle = searchParams.get('handle');

  if (!lensHandle) {
      return NextResponse.json({ error: 'Lens handle is required' }, { status: 400 });
  }

  try {
      console.log("Taking Screenshot...")  
      await takeScreenshot(lensHandle);
      return NextResponse.json({ status: 200 })
  } catch (error) {
      console.error('Error taking screenshot:', error);
      return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}

async function takeScreenshot(lensHandle :string) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 2560, height: 1440 }
      });
    
      const page = await browser.newPage();
      await page.goto(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', { waitUntil: 'networkidle2' });
    
    //    // Configure the recorder options
    //    const recorder = new PuppeteerScreenRecorder(page, {
    //     followNewTab: true,
    //     fps: 30,
    //     videoFrame: { width: 2560, height: 1440 },
    //   });
    
      // Define the input selector
      const inputSelector = 'input[placeholder="Enter Lens handle (e.g. avail_project)"]';
      await page.waitForSelector(inputSelector, { timeout: 100000 });
    
      // Click the input field to focus
      await page.click(inputSelector);
    
      // Ensure the input field is empty before typing
      await page.evaluate((selector) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) input.value = '';
      }, inputSelector);
    
      // Type the full lens handle, one character at a time with a small delay
      for (const char of lensHandle) {
        await page.type(inputSelector, char, { delay: 1000 });
        
      }
    
      // Fire blur event to ensure changes are registered
      await page.evaluate((selector) => {
        const input = document.querySelector(selector) as HTMLInputElement;
        if (input) {
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
      }, inputSelector);
    
      // Press Enter
      await page.keyboard.press('Enter');
        await sleep(10000);
    
       // Start recording and save to 'recording.mp4'
    //    await recorder.start('recording.mp4'); 
    
      // Wait for the network graph to load
      const networkGraphSelector = 'div.w-full.h-full canvas';
      await page.waitForSelector(networkGraphSelector, { timeout: 300000 });
    
    await sleep(10000)
      // Take a screenshot
      await page.screenshot({ path: `./storage/${lensHandle}_screenshot.png`, fullPage: true });
    
    // Stop recording
    // await recorder.stop();
    
      await browser.close();
      console.log('Screenshot captured and saved');
}


function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }