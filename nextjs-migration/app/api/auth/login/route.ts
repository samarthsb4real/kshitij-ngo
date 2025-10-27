import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createToken, setAuthCookie, checkRateLimit, resetRateLimit } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { username, password } = validation.data

    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp)
    
    if (!rateLimit.allowed) {
      const minutesLeft = rateLimit.lockoutEndsAt 
        ? Math.ceil((rateLimit.lockoutEndsAt.getTime() - Date.now()) / 60000)
        : 15
      
      return NextResponse.json(
        { 
          error: 'Too many login attempts',
          message: `Account temporarily locked. Please try again in ${minutesLeft} minutes.`,
          lockoutEndsAt: rateLimit.lockoutEndsAt
        },
        { status: 429 }
      )
    }

    // Authenticate user
    const user = await authenticateUser(username, password)

    if (!user) {
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          remainingAttempts: rateLimit.remainingAttempts
        },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIp)

    // Create JWT token
    const token = await createToken(user)

    // Set cookie
    await setAuthCookie(token)

    // Return success with user info (without sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
