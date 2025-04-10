import { NextRequest, NextResponse } from 'next/server';
import { buildNetwork } from '@/app/utils/network';
import { getAccountMetadata, getFollowerDetails } from '@/app/utils/lens-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const handle = params.handle;
    
    // Build the network using our utility functions
    const network = await buildNetwork(
      `lens/${handle}`,
      getAccountMetadata,
      getFollowerDetails,
      200
    );

    // Return the network data
    return NextResponse.json(network);
  } catch (error) {
    console.error('Error fetching network:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    );
  }
} 