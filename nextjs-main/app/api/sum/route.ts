import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body || !Array.isArray(body.numbers)) {
      return NextResponse.json(
        { error: 'Please provide a numbers array' },
        { status: 400 }
      );
    }

    // Call Flask backend
    const flaskResponse = await fetch('http://localhost:5000/sum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await flaskResponse.json();
    
    return NextResponse.json(data, { status: flaskResponse.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to Flask server' },
      { status: 500 }
    );
  }
}