'use server';

import { NextRequest, NextResponse } from 'next/server';

if (!process.env.BLESS_TOKEN) {
  throw new Error('BLESS_TOKEN environment variable is required for Browserless connection');
}

const BROWSERLESS_API = `https://production-sfo.browserless.io/screenshot?token=${process.env.BLESS_TOKEN}`;

export async function GET(req: NextRequest) {
  console.log('Requesting Screenshot');
  const { searchParams } = new URL(req.url);
  const lensHandle = searchParams.get('handle');

  if (!lensHandle) {
    return NextResponse.json({ error: 'Lens handle is required' }, { status: 400 });
  }

  // Validate the NEXT_PUBLIC_APP_URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lenscollective.me';
  const targetUrl = `${appUrl}/screenshot?handle=${lensHandle}`;

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

  try {
    console.log('Requesting screenshot from Browserless...');
    const response = await fetch(BROWSERLESS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        url: targetUrl,
        waitFor: '#network-graph',
        waitForTimeout: 15000,
        viewport: {
          width: 1280,
          height: 1280,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Browserless API returned ${response.status}: ${await response.text()}`);
    }

    const screenshotBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(screenshotBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error taking screenshot:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to capture screenshot',
        message: 'The screenshot process encountered an error. Please try again.',
      },
      { status: 500 }
    );
  }
}