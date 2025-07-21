// app/api/session/route.ts (server-side)

import { NextResponse } from 'next/server'
import { adminAuth } from '@/firebase/firebase-admin' 
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { token } = await request.json()
  try {
    // Set session expiration (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn })
    const cookiesStore = cookies(); 
    (await cookiesStore).set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
      sameSite: 'lax',
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('__session')?.value

  try {
    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie)
    return NextResponse.json({
      authenticated: true,
      uid: decodedToken.uid,
      email: decodedToken.email
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}

export async function DELETE() {
const cookieStore = cookies();
(await cookieStore).delete('__session')
  return NextResponse.json({ success: true })
}