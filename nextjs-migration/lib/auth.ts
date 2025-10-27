import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { AUTH_USERS, JWT_SECRET as CONFIG_JWT_SECRET } from './auth-config'

// Types
export type UserRole = 'admin' | 'umamane' | 'ajaymane' | 'avdhutkulkarni' | 'viewer'

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

export interface AuthUser extends User {
  passwordHash: string
}

// Get authorized users from config
const getAuthorizedUsers = (): AuthUser[] => {
  return AUTH_USERS
}

const SECRET_KEY = new TextEncoder().encode(CONFIG_JWT_SECRET)

const TOKEN_NAME = 'ngo-auth-token'
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Permission definitions
export const PERMISSIONS = {
  // Write operations
  canSubmitForm: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'] as UserRole[],
  canUpdateStatus: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'] as UserRole[],
  canEditData: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'] as UserRole[],
  
  // Read operations (all roles can view)
  canViewDashboard: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'] as UserRole[],
  canViewStudents: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'] as UserRole[],
} as const

// Permission check helpers
export const hasPermission = (userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean => {
  return PERMISSIONS[permission].includes(userRole)
}

export const requirePermission = (user: User | null, permission: keyof typeof PERMISSIONS): boolean => {
  if (!user) return false
  return hasPermission(user.role, permission)
}

// Hash password helper (for generating password hashes)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Verify password helper
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

// Create JWT token
export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as User
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  const users = getAuthorizedUsers()
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
  
  if (!user || !user.passwordHash) {
    // Add delay to prevent timing attacks
    await bcrypt.hash(password, 12)
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  
  if (!isValid) {
    return null
  }

  // Return user without password
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Get current user from cookies
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_NAME)

    if (!token) {
      return null
    }

    return await verifyToken(token.value)
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/'
  })
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Check if user has admin role
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts?: number; lockoutEndsAt?: Date } {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }

  // Check if lockout period has expired
  if (attempt.count >= MAX_ATTEMPTS) {
    const lockoutEndsAt = attempt.lastAttempt + LOCKOUT_DURATION
    if (now < lockoutEndsAt) {
      return { 
        allowed: false, 
        lockoutEndsAt: new Date(lockoutEndsAt)
      }
    } else {
      // Reset after lockout period
      loginAttempts.set(identifier, { count: 1, lastAttempt: now })
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
    }
  }

  // Increment attempt count
  attempt.count++
  attempt.lastAttempt = now
  loginAttempts.set(identifier, attempt)

  if (attempt.count >= MAX_ATTEMPTS) {
    return { 
      allowed: false, 
      lockoutEndsAt: new Date(now + LOCKOUT_DURATION)
    }
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempt.count }
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier)
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  loginAttempts.forEach((value, key) => {
    if (now - value.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(key)
    }
  })
}, 60 * 60 * 1000) // Clean up every hour
