'use server';

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
console.log("Requesting Screenshot")
  const { searchParams } = new URL(req.url);
  const lensHandle = searchParams.get('handle');

  if (!lensHandle) {
      return NextResponse.json({ error: 'Lens handle is required' }, { status: 400 });
  }

  try {
      console.log("Taking Screenshot...")  
      //taking screenshot
      await takeScreenshot(lensHandle);
     
       // 2. Verify the image exists
      const imagePath = `../storage/${lensHandle}_network_graph.png`;
      const fullPath = path.join(process.cwd(), 'public', imagePath);

      if (!fs.existsSync(fullPath)) {
        return NextResponse.json(
          { error: 'Graph image not found' },
          { status: 404 }
        );
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
      return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}

async function takeScreenshot(lensHandle :string) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
      });
    
      const page = await browser.newPage();
      await page.goto(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', { waitUntil: 'networkidle2' });
    
      const inputContainerSelector = 'div.absolute.top-4.left-1\\/2';
      await page.waitForSelector(inputContainerSelector, { timeout: 100000 });

      try {
        await page.waitForSelector(inputContainerSelector, { timeout: 10000 });
        console.log('Floating search bar found.');
    
        // Click to activate the input
        await page.click(inputContainerSelector);
        await sleep(300);
    
        // Select the actual input field that CreatableSelect renders
        const reactInputSelector = 'div.select__control input';
    
        await page.waitForSelector(reactInputSelector, { timeout: 5000 });
    
        // Clear existing input just in case
        await page.focus(reactInputSelector);
        await page.click(reactInputSelector, { clickCount: 3 });
        await page.keyboard.press('Backspace');
    
        await page.type(reactInputSelector, `${lensHandle}`, { delay: 100 });
    
        
    
        // Wait a little to simulate user pause
        await sleep(500);
        await page.keyboard.press('Enter');
        // Wait a little to simulate user pause
        await sleep(500);
        // Wait for the "Visualize Network" button to appear
        await page.waitForSelector('div.flex.flex-row.gap-2.w-full.md\\:w-auto > button:first-of-type', { visible: true });
    
        // Click the "Visualize Network" button
        await page.click('div.flex.flex-row.gap-2.w-full.md\\:w-auto > button:first-of-type');
    
        console.log('Clicked "Visualize Network" button.');
        console.log('Lens handle entered.');
    
        await sleep(50000); // Wait for the graph to respond/render
    
      } catch (error) {
        console.error('Error selecting or interacting with input:', error);
      }
    
      // Screenshot + crop logic
      const networkGraphSelector = '#network-graph canvas';
      try {
        await page.waitForSelector(networkGraphSelector, { timeout: 30000 });
        console.log('Network graph loaded.');
    
        await page.screenshot({ path: `./storage/${lensHandle}_full.png` });
    
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
    
        await sharp(`./storage/${lensHandle}_full.png`)
          .extract(clip)
          .toFile(`./storage/${lensHandle}_network_graph.png`);
        console.log(`Graph stored to ./storage/${lensHandle}_network_graph.png`)
    
        await browser.close();
      } catch (error) {
        console.error('Graph did not load in time:', error);
      }
}


function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}