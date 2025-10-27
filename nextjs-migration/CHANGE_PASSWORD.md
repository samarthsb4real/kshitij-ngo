# 🔐 Quick Authentication Setup

## Current Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Change Password (2 Simple Steps)

### Step 1: Generate New Password Hash

```bash
node scripts/generate-password-hash.js YourNewPassword123
```

This will output something like:
```
ADMIN_PASSWORD_HASH=$2b$12$ABC123XYZ...
```

### Step 2: Update Configuration File

Open `lib/auth-config.ts` and paste the generated hash:

```typescript
export const AUTH_USERS = [
  {
    id: '1',
    username: 'admin',  // ← Change this if you want a different username
    passwordHash: '$2b$12$ABC123XYZ...',  // ← Paste the generated hash here
    role: 'admin' as const,
    name: 'Administrator'
  }
]
```

### Step 3: Restart Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

That's it! 🎉

## Add More Users

Just add another object to the AUTH_USERS array in `lib/auth-config.ts`:

```typescript
export const AUTH_USERS = [
  {
    id: '1',
    username: 'admin',
    passwordHash: '$2b$12$...',
    role: 'admin' as const,
    name: 'Administrator'
  },
  {
    id: '2',
    username: 'viewer',
    passwordHash: '$2b$12$...',  // Generate this with the script
    role: 'viewer' as const,
    name: 'Viewer Account'
  }
]
```

## Verify Your Password

Test if a password matches a hash:

```bash
node scripts/verify-password.js YourPassword '$2b$12$...'
```

## Troubleshooting

**Login still fails after changing password?**
1. Make sure you restarted the server
2. Clear your browser cookies
3. Try in an incognito/private window
4. Verify the hash with the verify-password script

**Want to use environment variables instead?**
- See `AUTH_README.md` for advanced configuration

---

**Files to Edit:**
- `lib/auth-config.ts` - Main configuration (username, password hash)
- Generate hashes with: `scripts/generate-password-hash.js`
