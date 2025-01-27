import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ...existing code...

export async function middleware(request: NextRequest) {
    const publicPaths = ['/login', '/register']
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Allow direct access to public paths
    if (isPublicPath) {
        // Only check if user is already logged in
        try {
            const token = request.cookies.get('accessToken')?.value
            if (token) {
                // Simple token verification (replace with your verification logic)
                const payload = decodeJWT(token)
                if (payload?.userId) {
                    return NextResponse.redirect(new URL('/tasks', request.url))
                }
            }
        } catch {
            // If not authenticated, allow access to public path
        }
        return NextResponse.next()
    }
    else {
        // Protected routes
        try {
            const token = request.cookies.get('accessToken')?.value
            if (!token) throw new Error('No token')

            // Simple token verification (replace with your verification logic)
            const payload = decodeJWT(token)
            if (!payload?.userId) throw new Error('Invalid token')

            return NextResponse.next()
        } catch (error) {
            console.log(error)
            const response = NextResponse.redirect(new URL('/login', request.url))
            response.cookies.delete('accessToken')
            response.cookies.delete('refreshToken')
            return response
        }
    }
}

// Simple JWT decoder (replace with secure verification)
function decodeJWT(token: string) {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}

export const config = {
    matcher: [
        '/tasks/:path*',
        '/login',
        '/register'
    ]
}