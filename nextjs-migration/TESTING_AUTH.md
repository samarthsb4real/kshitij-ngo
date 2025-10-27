# 🎯 Authentication Testing Guide

## Quick Test Steps

### 1. Access Dashboard (Should Redirect to Login)
```
http://localhost:3001/dashboard
```
**Expected:** Redirected to `/login`

### 2. Login with Default Credentials
- **URL:** `http://localhost:3001/login`
- **Username:** `admin`
- **Password:** `admin123`
- **Expected:** Successful login → Redirect to dashboard

### 3. Verify Dashboard Access
- **Expected:** See dashboard with user info in header
- **Expected:** See "Administrator" badge and "admin" role
- **Expected:** Logout button visible

### 4. Test Logout
- Click "Logout" button
- **Expected:** Redirected to login page
- **Expected:** Cannot access dashboard without re-authenticating

### 5. Test Rate Limiting
- Try logging in with wrong password 5 times
- **Expected:** Account locked for 15 minutes after 5 attempts
- **Expected:** Error message with lockout time

### 6. Test Protected Routes
Try accessing these URLs without logging in:
- `http://localhost:3001/dashboard` → Should redirect to login
- `http://localhost:3001/students` → Should redirect to login (if students page exists)

### 7. Test Auto-Redirect
- Login successfully
- Try accessing `/login` while authenticated
- **Expected:** Automatically redirected to dashboard

## Test Results Checklist

- [ ] Dashboard redirects to login when not authenticated
- [ ] Login form accepts credentials
- [ ] Successful login redirects to dashboard
- [ ] User info displays in dashboard header
- [ ] Logout button works
- [ ] After logout, cannot access dashboard
- [ ] Rate limiting works (5 attempts)
- [ ] Protected routes require authentication
- [ ] Already logged-in users can't access login page
- [ ] Session persists across page refreshes
- [ ] Session expires after 7 days (manual test)

## Common Issues & Solutions

### Issue: "Invalid credentials" with correct password
**Solution:** Check `.env.local` has correct `ADMIN_PASSWORD_HASH`

### Issue: Infinite redirect loop
**Solution:** Clear browser cookies and try again

### Issue: Rate limit not working
**Solution:** Restart the dev server to reset rate limits

### Issue: Cannot see user info in header
**Solution:** Check browser console, verify `/api/auth/me` returns data

## Manual Security Tests

### 1. Cookie Security
Open DevTools → Application → Cookies
- Verify cookie name: `ngo-auth-token`
- Verify `HttpOnly` flag is set
- Verify `Secure` flag in production
- Verify `SameSite=Lax`

### 2. Token Expiration
- Login and note the time
- Wait 7 days (or modify code for testing)
- Try accessing dashboard
- **Expected:** Redirected to login

### 3. Token Tampering
- Login successfully
- Open DevTools → Application → Cookies
- Modify the token value
- Refresh the page
- **Expected:** Redirected to login (invalid token)

### 4. Concurrent Sessions
- Login on Browser A
- Login on Browser B
- Both should work independently
- Logout on Browser A
- Browser B should still be logged in

## Performance Tests

### Login Response Time
- Normal case: < 500ms
- Rate limited: Immediate rejection
- Wrong password: ~1-2s (bcrypt comparison)

### Dashboard Load Time
- First visit (authenticated): < 1s
- Subsequent visits: < 500ms (cached)

## Generating New Password

```bash
# Generate hash for new password
node scripts/generate-password-hash.js NewSecurePassword123!

# Copy the output and update .env.local
ADMIN_PASSWORD_HASH=<paste-hash-here>

# Restart server
npm run dev
```

## API Testing with cURL

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

### Check Auth Status
```bash
curl http://localhost:3001/api/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -b cookies.txt
```

---

**Status:** ✅ Ready for testing
**Last Updated:** October 27, 2025
