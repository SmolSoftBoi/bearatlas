import { NextResponse } from 'next/server';

export async function GET() {
  // Minimal graceful placeholder — no secrets here
  const token = null; // Implement real token generation in backend when secrets available
  if (!token) {
    return NextResponse.json(
      {
        error: 'Apple Maps not configured',
        message: 'Please configure Apple Developer credentials'
      },
      { status: 503 }
    );
  }
  return NextResponse.json(token);
}
