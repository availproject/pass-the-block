import { NextRequest, NextResponse } from 'next/server';
import { buildNetwork } from '@/app/utils/network';
import { getAccountMetadata, getFollowerDetails } from '@/app/utils/lens-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  console.log('🔍 Network API Request:', {
    handle: params.handle,
    url: request.url
  });

  try {
    // Remove 'lens/' prefix if present
    const handle = params.handle.replace('lens/', '');
    console.log('📝 Processing handle:', { original: params.handle, processed: handle });
    
    // Build the network using our utility functions
    console.log('🏗️ Starting network build for handle:', handle);
    const network = await buildNetwork(
      handle,
      getAccountMetadata,
      getFollowerDetails,
      200
    );

    console.log('✅ Network built successfully:', {
      nodes: network.nodes.length,
      links: network.links.length
    });

    // Return the network data
    return NextResponse.json(network);
  } catch (error) {
    console.error('❌ Error in network API:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    );
  }
} 