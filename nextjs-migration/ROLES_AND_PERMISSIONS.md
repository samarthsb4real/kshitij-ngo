# 🔐 Roles and Permissions

## Available Roles

The system has **5 user roles** with different permission levels:

### 1. **Admin** (`admin`)
- Full access to all features
- Can submit forms
- Can update student status
- Can edit data
- Can view all information

### 2. **Uma Mane** (`umamane`)
- Can submit forms ✅
- Can update student status ✅
- Can edit data ✅
- Can view all information ✅
- Same permissions as Admin

### 3. **Ajay Mane** (`ajaymane`)
- Can submit forms ✅
- Can update student status ✅
- Can edit data ✅
- Can view all information ✅
- Same permissions as Admin

### 4. **Avdhut Kulkarni** (`avdhutkulkarni`)
- Can submit forms ✅
- Can update student status ✅
- Can edit data ✅
- Can view all information ✅
- Same permissions as Admin

### 5. **Viewer** (`viewer`)
- ❌ Cannot submit forms
- ❌ Cannot update student status
- ❌ Cannot edit data
- ✅ Can view dashboard
- ✅ Can view student information
- **Read-only access**

---

## Current User Credentials

| Username | Password | Role | Name |
|----------|----------|------|------|
| `admin` | `admin@9402` | admin | Administrator |
| `umamane` | `umamane@7234` | umamane | Uma Mane |
| `ajaymane` | `ajaymane@8951` | ajaymane | Ajay Mane |
| `avdhutkulkarni` | `avdhutkulkarni@4672` | avdhutkulkarni | Avdhut Kulkarni |
| `viewer` | `viewer@3158` | viewer | Viewer Account |

---

## Permission Details

### What Viewers CANNOT Do:
1. **Submit Forms** - The `/form` page shows "Access Denied" message
2. **Update Status** - Student status dropdown is replaced with a read-only badge
3. **Edit Data** - No edit buttons or modification capabilities

### What Viewers CAN Do:
1. **View Dashboard** - Full access to analytics and statistics
2. **View Students** - Can see all student profiles and details
3. **Export PDFs** - Can download student profile PDFs
4. **Search & Filter** - Can use all search and filtering features

### What All Other Roles (admin, umamane, ajaymane, avdhutkulkarni) CAN Do:
1. **Everything** - Full access to all features
2. **Submit Forms** - Can add new student applications
3. **Update Status** - Can change student approval status
4. **Edit Data** - Full editing capabilities

---

## How Permissions Work

### Backend Protection (API Routes)
All write operations check permissions:
- `/api/submit-form` - Requires `canSubmitForm` permission
- `/api/update-status` - Requires `canUpdateStatus` permission

If a viewer tries to access these APIs directly, they get a **403 Forbidden** response:
```json
{
  "error": "Unauthorized. You do not have permission to submit forms."
}
```

### Frontend Protection (UI)
Components check permissions before rendering:
- **Form Page** - Shows "Access Denied" for viewers
- **Status Dropdown** - Hidden for viewers (shows badge instead)
- **Apply Button** - Hidden in dashboard navigation for viewers

---

## Changing Permissions

To change which roles have which permissions, edit `/lib/auth.ts`:

```typescript
export const PERMISSIONS = {
  canSubmitForm: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canUpdateStatus: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canEditData: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canViewDashboard: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'],
  canViewStudents: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'],
}
```

**Example**: To give viewers permission to update status:
```typescript
canUpdateStatus: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'],
```

---

## Adding New Users

See `CHANGE_PASSWORD.md` for instructions on adding new users.

To add a user with a different role:
1. Generate password hash: `node scripts/generate-password-hash.js password123`
2. Edit `lib/auth-config.ts` and add to `AUTH_USERS` array:
```typescript
{
  id: '6',
  username: 'newuser',
  passwordHash: 'paste-hash-here',
  role: 'viewer' as const, // or 'admin'
  name: 'New User Name'
}
```
3. Update `UserRole` type in `lib/auth.ts` if adding a new role type
4. Add the new role to permission arrays as needed
5. Restart server: `npm run dev`

---

## Security Features

✅ **Backend Validation** - API routes verify permissions before processing  
✅ **Frontend Protection** - UI hides unauthorized actions  
✅ **Type Safety** - TypeScript ensures roles are valid  
✅ **JWT Tokens** - Secure session management  
✅ **HTTP-Only Cookies** - Token can't be accessed by JavaScript  
✅ **Role-Based Access Control** - Granular permission system  

---

## Testing Permissions

1. **Test Viewer Access**:
   - Login as `viewer` / `viewer@3158`
   - Try to access `/form` → Should see "Access Denied"
   - Go to student profile → Status should be read-only badge
   - Dashboard should hide "Apply" button

2. **Test Admin Access**:
   - Login as any admin role
   - Should see "Apply" button in dashboard
   - Can access `/form` page
   - Can change student status via dropdown

---

## Troubleshooting

**Q: I changed permissions but they're not working**
- Restart the server: `npm run dev`
- Clear browser cookies and login again
- Check that you updated both `lib/auth.ts` and `hooks/use-permissions.ts`

**Q: How do I make a role admin-only?**
- Add to permission array: `['admin']`
- Example: `canDeleteData: ['admin']`

**Q: Can I have custom roles?**
- Yes! Add the role name to `UserRole` type in `lib/auth.ts`
- Add user with that role in `lib/auth-config.ts`
- Configure permissions as needed

---

**Last Updated**: October 27, 2025
