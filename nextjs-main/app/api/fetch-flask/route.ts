// app/api/fetch-flask/route.js
export async function GET() {
  // Replace with your actual Flask endpoint
  const flaskUrl = 'http://127.0.0.1:8000/api/data';

  try {
    const res = await fetch(flaskUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from Flask' }), { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    let errormessage = "Unknown Error"
    if (error instanceof Error) {
      errormessage = error.message
    }
    return new Response(JSON.stringify({ error: errormessage }), { status: 500 });
  }
}
