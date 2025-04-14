import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { imageDataUrl, fileName } = data;

    // Validate input
    if (!imageDataUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the image data is a base64 encoded data URL
    if (!imageDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    // Create directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Extract base64 data
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Add .png extension if not present
    const finalFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    const filePath = path.join(imagesDir, finalFileName);

    // Write the file to disk
    fs.writeFileSync(filePath, buffer);

    // Return the URL path to the saved image
    return NextResponse.json({
      success: true,
      imageUrl: `images/${finalFileName}`
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { error: 'Failed to save image', message: (error as Error).message },
      { status: 500 }
    );
  }
} 