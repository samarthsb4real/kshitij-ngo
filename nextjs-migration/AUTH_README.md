# 🔐 Authentication System Documentation

## Overview

The dashboard now has enterprise-grade authentication with the following security features:

- ✅ JWT (JSON Web Token) based authentication
- ✅ Bcrypt password hashing (12 rounds)
- ✅ HTTP-only secure cookies
- ✅ Rate limiting (5 attempts, 15-minute lockout)
- ✅ Protected routes with middleware
- ✅ Automatic token expiration (7 days)
- ✅ Secure session management
- ✅ CSRF protection via SameSite cookies

## Default Credentials

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION**

- **Username:** `admin`
- **Password:** `admin123`

## Quick Start

### 1. Access the Dashboard

Navigate to: `http://localhost:3000/dashboard`

You will be automatically redirected to the login page if not authenticated.

### 2. Login

Enter your credentials on the login page at `/login`

### 3. Change Default Password

**Important:** Generate a new password hash for production:

```bash
node scripts/generate-password-hash.js YourNewSecurePassword123!
```

Copy the generated hash and update your `.env.local` file:

```env
ADMIN_PASSWORD_HASH=<paste-generated-hash-here>
```

### 4. Restart the Server

```bash
npm run dev
```

## Security Features

### 1. Password Hashing
- Uses bcrypt with 12 salt rounds
- Industry-standard hashing algorithm
- Resistant to rainbow table attacks

### 2. JWT Tokens
- Signed with HS256 algorithm
- Contains user ID, username, and role
- Expires after 7 days
- Stored in HTTP-only cookies

### 3. Rate Limiting
- Maximum 5 login attempts per IP
- 15-minute lockout after exceeding limit
- Automatic cleanup of old attempts
- Prevents brute force attacks

### 4. Secure Cookies
- HTTP-only (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- 7-day expiration

### 5. Route Protection
- Middleware protects `/dashboard` and `/students` routes
- Automatic redirect to login for unauthenticated users
- Automatic redirect to dashboard for authenticated users on login page

## API Endpoints

### POST /api/auth/login
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "name": "Administrator"
  }
}
```

**Error Responses:**
- `400` - Invalid input
- `401` - Invalid credentials (with remaining attempts)
- `429` - Too many attempts (rate limited)
- `500` - Server error

### POST /api/auth/logout
Logout and clear authentication cookie.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
Get current authenticated user information.

**Success Response (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "name": "Administrator"
  }
}
```

**Error Response (401):**
```json
{
  "authenticated": false
}
```

## Environment Variables

### Required Variables

```env
# JWT Secret - Must be at least 32 characters
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxPyZn9dO
```

### Generating Secure Values

#### JWT Secret
```bash
# Generate a random 32+ character string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Password Hash
```bash
# Use the provided script
node scripts/generate-password-hash.js YourSecurePassword123!
```

## User Roles

Currently supported roles:

- **admin**: Full access to all dashboard features
- **viewer**: Read-only access (future implementation)

## Adding More Users

To add more users, update the `getAuthorizedUsers()` function in `lib/auth.ts`:

```typescript
const getAuthorizedUsers = (): AuthUser[] => {
  return [
    {
      id: '1',
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
      role: 'admin',
      name: 'Administrator'
    },
    // Add more users here
    {
      id: '2',
      username: process.env.VIEWER_USERNAME || 'viewer',
      passwordHash: process.env.VIEWER_PASSWORD_HASH || '',
      role: 'viewer',
      name: 'Viewer'
    }
  ]
}
```

Then add corresponding environment variables:

```env
VIEWER_USERNAME=viewer
VIEWER_PASSWORD_HASH=<generated-hash>
```

## Production Deployment Checklist

- [ ] Change default username from `admin`
- [ ] Generate strong password (12+ characters, mixed case, numbers, symbols)
- [ ] Generate new password hash using the script
- [ ] Generate random JWT secret (32+ characters)
- [ ] Update all environment variables in production
- [ ] Ensure HTTPS is enabled
- [ ] Test login/logout functionality
- [ ] Verify rate limiting works
- [ ] Check that protected routes require authentication
- [ ] Confirm cookies are secure and HTTP-only

## Troubleshooting

### "Invalid credentials" error
- Verify username and password are correct
- Check that ADMIN_PASSWORD_HASH matches your password
- Ensure environment variables are loaded

### "Too many attempts" error
- Wait 15 minutes for lockout to expire
- Clear rate limit manually (restart server)
- Check if IP address is correct

### Redirected to login unexpectedly
- Check if token has expired (7 days)
- Verify JWT_SECRET hasn't changed
- Clear cookies and login again

### Cannot access dashboard after login
- Check browser console for errors
- Verify middleware is working
- Ensure cookies are being set correctly

## Security Best Practices

1. **Never commit sensitive data**
   - Add `.env.local` to `.gitignore`
   - Use different credentials per environment

2. **Use strong passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Avoid dictionary words

3. **Rotate credentials regularly**
   - Change passwords every 90 days
   - Generate new JWT secrets periodically

4. **Monitor login attempts**
   - Check server logs for suspicious activity
   - Implement additional monitoring if needed

5. **Keep dependencies updated**
   - Regularly run `npm audit`
   - Update security-related packages

## Files Structure

```
lib/
  └── auth.ts                          # Core authentication logic
app/
  ├── login/
  │   └── page.tsx                     # Login page UI
  └── api/
      └── auth/
          ├── login/
          │   └── route.ts             # Login endpoint
          ├── logout/
          │   └── route.ts             # Logout endpoint
          └── me/
              └── route.ts             # Current user endpoint
middleware.ts                          # Route protection
scripts/
  └── generate-password-hash.js        # Password hash generator
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment variables
4. Test with default credentials first

---

**Last Updated:** October 27, 2025
