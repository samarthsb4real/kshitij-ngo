import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { JWT_SECRET } from './lib/auth-config'

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/students']

// Public routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get token from cookies
  const token = request.cookies.get('ngo-auth-token')?.value

  // Verify token
  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY)
      isAuthenticated = true
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false
    }
  }

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route without authentication
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect to dashboard if trying to access login while authenticated
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/students/:path*',
    '/login'
  ]
}
