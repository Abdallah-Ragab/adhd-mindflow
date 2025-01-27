
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  // Authenticate user
  const user = await authenticateUser(email, password)
  if (!user) {
    return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 })
  }

  // Generate tokens
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  const response = NextResponse.json({ message: 'Login successful' })

  // Set HTTP-only cookies
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    path: '/',
    // secure: true, // Uncomment in production
    sameSite: 'lax',
  })
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/',
    // secure: true, // Uncomment in production
    sameSite: 'lax',
  })

  return response
}

// ...existing authentication and token generation functions...