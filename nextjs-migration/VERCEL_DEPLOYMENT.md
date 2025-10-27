# 🚀 Vercel Deployment Guide

## Environment Variables to Set in Vercel

Go to your Vercel project settings → Environment Variables and add these:

### 1. **NEXT_PUBLIC_GOOGLE_SCRIPT_URL** (Required)
```
https://script.google.com/macros/s/AKfycbzM-7XZh4ehhpPv7yFnVsiDUj6u6wlMx0OEw3yimjdG9eYaxPV_XjnYQ1Qm6F5QzGLo/exec
```

### 2. **JWT_SECRET** (Required)
Generate a random secret (32+ characters):
```
your-super-secret-jwt-key-change-this-to-random-string-min-32-chars
```

⚠️ **IMPORTANT**: Change this to a unique random string for security!

### 3. **AUTH_USERS** (Required)
Copy this entire JSON array (all on one line):

```json
[{"id":"1","username":"admin","passwordHash":"$2b$12$iSe05E4x1AW3nnSvcgoSA.QtoYK7vyw9R0bO2IIuneu7vIx0S..Qa","role":"admin","name":"Administrator"},{"id":"2","username":"umamane","passwordHash":"$2b$12$PF6dRfRvD.Z/c5OMifAROuQVh8XQR/9o1OhFfDm8JvafHxg3lhhwi","role":"umamane","name":"Uma Mane"},{"id":"3","username":"ajaymane","passwordHash":"$2b$12$RWchZwD2lD9iiYFDoRHNXOEGZOsvhr2gAMX4vz/pz6bWsAoHLlj/O","role":"ajaymane","name":"Ajay Mane"},{"id":"4","username":"avdhutkulkarni","passwordHash":"$2b$12$sr7ArWCUxAoGKBewcpG01uKJ/XA61FAK99R0H5QylrYt4NdjyEQwm","role":"avdhutkulkarni","name":"Avdhut Kulkarni"},{"id":"5","username":"viewer","passwordHash":"$2b$12$kX7juzds9vJJpxyW4edbZuW6Xb9llhWSIl98rW4/TNpwdQRM3GZpq","role":"viewer","name":"Viewer Account"}]
```

This includes all 5 users with their credentials from ROLES_AND_PERMISSIONS.md.

---

## Current User Credentials (from AUTH_USERS above)

| Username | Password | Role |
|----------|----------|------|
| admin | admin@9402 | admin |
| umamane | umamane@7234 | umamane |
| ajaymane | ajaymane@8951 | ajaymane |
| avdhutkulkarni | avdhutkulkarni@4672 | avdhutkulkarni |
| viewer | viewer@3158 | viewer |

---

## Step-by-Step Deployment

### Option 1: Using Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Navigate to your project → Settings → Environment Variables

2. **Add Each Variable**:
   - Click "Add New"
   - Name: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - Value: (paste the Google Script URL)
   - Environment: Production, Preview, Development (check all)
   - Click "Save"

3. **Repeat for JWT_SECRET and AUTH_USERS**

4. **Redeploy**:
   - Go to Deployments → Click "..." on latest deployment → "Redeploy"
   - Or push a new commit to trigger automatic deployment

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL
# Paste the URL and press Enter

vercel env add JWT_SECRET
# Paste your secret and press Enter

vercel env add AUTH_USERS
# Paste the entire JSON array and press Enter

# Deploy
vercel --prod
```

---

## Verifying Deployment

After deployment:

1. **Visit your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Go to `/login`**
3. **Test login with any user** (e.g., `admin` / `admin@9402`)
4. **Verify dashboard loads** and authentication works
5. **Test viewer role** - login as `viewer` / `viewer@3158` and confirm no edit access

---

## Troubleshooting

### Build fails with "Module not found: Can't resolve './auth-config'"
✅ **Fixed!** The app now falls back to environment variables when `auth-config.ts` is not available.

### "Invalid credentials" after deployment
- Check that `AUTH_USERS` environment variable is set correctly in Vercel
- Ensure it's valid JSON (no line breaks in the middle of the array)
- Verify `JWT_SECRET` is set

### Authentication not working
- Clear browser cookies
- Check Vercel deployment logs for errors
- Verify all 3 environment variables are set in Vercel dashboard

### Need to change passwords in production
1. Generate new hash locally: `node scripts/generate-password-hash.js NewPassword123`
2. Update the `AUTH_USERS` JSON in Vercel with the new hash
3. Redeploy or wait for automatic redeployment

---

## Security Notes for Production

⚠️ **Before going live:**

1. **Change JWT_SECRET** to a unique random string (use password generator)
2. **Change all user passwords** - current ones are examples
3. **Use HTTPS only** (Vercel does this automatically)
4. **Review user roles** - disable or remove accounts you don't need
5. **Monitor access logs** - check Vercel analytics for suspicious activity

---

## Quick Copy-Paste for Vercel

**Environment Variables** (copy these exactly):

```bash
# Variable 1
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzM-7XZh4ehhpPv7yFnVsiDUj6u6wlMx0OEw3yimjdG9eYaxPV_XjnYQ1Qm6F5QzGLo/exec

# Variable 2  
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars

# Variable 3 (all on ONE line, no line breaks!)
AUTH_USERS=[{"id":"1","username":"admin","passwordHash":"$2b$12$iSe05E4x1AW3nnSvcgoSA.QtoYK7vyw9R0bO2IIuneu7vIx0S..Qa","role":"admin","name":"Administrator"},{"id":"2","username":"umamane","passwordHash":"$2b$12$PF6dRfRvD.Z/c5OMifAROuQVh8XQR/9o1OhFfDm8JvafHxg3lhhwi","role":"umamane","name":"Uma Mane"},{"id":"3","username":"ajaymane","passwordHash":"$2b$12$RWchZwD2lD9iiYFDoRHNXOEGZOsvhr2gAMX4vz/pz6bWsAoHLlj/O","role":"ajaymane","name":"Ajay Mane"},{"id":"4","username":"avdhutkulkarni","passwordHash":"$2b$12$sr7ArWCUxAoGKBewcpG01uKJ/XA61FAK99R0H5QylrYt4NdjyEQwm","role":"avdhutkulkarni","name":"Avdhut Kulkarni"},{"id":"5","username":"viewer","passwordHash":"$2b$12$kX7juzds9vJJpxyW4edbZuW6Xb9llhWSIl98rW4/TNpwdQRM3GZpq","role":"viewer","name":"Viewer Account"}]
```

---

**Last Updated**: October 27, 2025
