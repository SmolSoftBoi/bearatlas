import { NextResponse } from 'next/server';
import { generateAppleMapsToken } from '@/lib/appleMaps';

export async function GET() {
  try {
    const token = await generateAppleMapsToken();
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Apple Maps token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}