import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { extractAccessToken } from './app/api/lib/request'
import { validateAccessToken } from './app/api/lib/jwt'
import { ApiException, getAPIExceptionResponse } from './app/api/lib/error'
import { MissingTokenError, TokenError } from './app/api/lib/jwt/errors'

export async function middleware(request: NextRequest) {
  console.log("Middleware")
  try {
    // Get token
    const accessToken = await extractAccessToken(request)
    console.log(accessToken)
    // validate the token
    const accessTokenDetails = await validateAccessToken(accessToken)
    console.log(accessTokenDetails)
    // proceed to next middleware
    return NextResponse.next()
  }
  catch (err: ApiException | Error | any) {
    console.error('caught error:', err)
    // Return error JSON response if token is expired
    if (err instanceof MissingTokenError) {
      return getAPIExceptionResponse(err)
    }
    // Redirect to login if Token is missing, invalid
    else if (err instanceof TokenError) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: [
    "/tasks/:path*",
    "/api/:path*",
  ]
}