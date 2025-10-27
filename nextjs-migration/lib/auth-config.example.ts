// ============================================================
// 🔐 AUTHENTICATION CONFIGURATION EXAMPLE
// ============================================================
//
// Copy this file to auth-config.ts and configure your credentials
//
// SIMPLE 2-STEP SETUP:
//
// 1. To change the password:
//    Run: node scripts/generate-password-hash.js YourNewPassword
//    Copy the generated hash
//
// 2. Paste the hash in the passwordHash field below
//    Change username if needed
//
// 3. Restart the server: npm run dev
//
// ============================================================

export const AUTH_USERS = [
  {
    id: '1',
    username: 'admin',
    // Password: admin123 (CHANGE THIS!)
    passwordHash: '$2b$12$wVixJnmCGvnFy02/L1fkNub.y75R2lCkpWJCFD6Cj.uy8fT2s55fy',
    role: 'admin' as const,
    name: 'Administrator'
  }
  // Add more users here if needed:
  // {
  //   id: '2',
  //   username: 'viewer',
  //   passwordHash: 'paste-generated-hash-here',
  //   role: 'viewer' as const,
  //   name: 'Viewer Account'
  // }
]

// JWT Secret - Change this to a random string in production
// Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
export const JWT_SECRET = 'your-super-secret-jwt-key-change-this-to-random-string-min-32-chars-for-production'

// ============================================================
// Don't edit below this line unless you know what you're doing
// ============================================================
