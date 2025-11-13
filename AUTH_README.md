# Authentication System Documentation

## Overview

This application now includes a complete authentication system with a 15-second timer that prompts users to log in or register.

## Features

### ✅ 15-Second Modal Timer
- After 15 seconds of using the app, users are prompted to log in/register
- Modal is full-screen and blocks interaction
- Timer only runs once per session
- Logged-in users never see the timer again

### ✅ User Authentication
- **Register**: Create a new account with name, email, and password
- **Login**: Sign in with existing credentials
- **Logout**: Clear session and return to unauthenticated state
- **Session Persistence**: Stay logged in across page refreshes

### ✅ Protected Features
- **Export PNG**: Requires authentication
- **API Routes** (future): Protected via middleware
- User profile display in header

## Implementation Details

### Storage Strategy
- **LocalStorage-based** authentication for simplicity
- Users stored in `mymap_users` key
- Active session in `mymap_auth` key
- **⚠️ NOTE**: For production, replace with proper backend authentication

### Components

#### `AuthModal.tsx`
- Full-screen login/register modal
- Switches between login and register modes
- Form validation and error handling

#### `AuthTimer.tsx`
- Manages the 15-second countdown
- Checks for existing auth on mount
- Shows modal only once per session

### State Management

#### Zustand Store (`lib/state/store.ts`)
```typescript
{
  user?: AuthUser;              // Current logged-in user
  hasSeenAuthModal: boolean;    // Prevent showing timer again
  setUser: (user) => void;      // Set authenticated user
  setHasSeenAuthModal: (bool) => void;
  logout: () => void;           // Clear session
}
```

### Middleware (`middleware.ts`)
- Protects API routes: `/api/export`, `/api/share`, `/api/presets`
- Validates `Authorization` header
- Returns 401 for unauthenticated requests

## User Experience Flow

1. **First Visit** (0-15 seconds)
   - User can explore the app freely
   - All features accessible

2. **After 15 Seconds**
   - Full-screen auth modal appears
   - User must log in or register to continue
   - Cannot close modal without authenticating

3. **After Authentication**
   - Modal disappears
   - User name displayed in header
   - Export PNG and other premium features unlocked
   - Session persists across refreshes

4. **Logout**
   - Click "Logout" in header
   - Session cleared
   - Timer will show again after 15 seconds on next visit

## Security Considerations

### Current Implementation (Development)
- ✅ Client-side only
- ✅ LocalStorage-based
- ⚠️ Passwords stored in plain text
- ⚠️ No server-side validation

### Production Requirements
To make this production-ready, implement:

1. **Backend Authentication**
   - Use NextAuth.js, Supabase, or Firebase Auth
   - Secure password hashing (bcrypt, argon2)
   - JWT tokens or session cookies
   - Rate limiting on auth endpoints

2. **API Security**
   - Validate JWT tokens server-side
   - CSRF protection
   - Secure HTTP-only cookies
   - Environment variables for secrets

3. **User Data**
   - Database storage (PostgreSQL, MongoDB)
   - Encrypted user data
   - Password reset flow
   - Email verification

## Customization

### Change Timer Duration
Edit `AUTH_TIMER_DURATION` in `components/AuthTimer.tsx`:

```typescript
const AUTH_TIMER_DURATION = 15000; // 15 seconds (in milliseconds)
```

### Add More Protected Features
Update the auth check pattern:

```typescript
const user = useAppStore((s) => s.user);

if (!user) {
  alert("Please log in to use this feature");
  return;
}
// Feature code here
```

### Modify Protected Routes
Edit `middleware.ts`:

```typescript
const protectedRoutes = [
  "/api/export",
  "/api/share",
  "/api/presets",
  "/api/your-new-route", // Add here
];
```

## Testing

### Test User Flow
1. Open app in incognito/private window
2. Wait 15 seconds
3. Register a new account
4. Verify login persists on refresh
5. Test logout
6. Try exporting without login (should be blocked)

### Test Accounts (Development)
Accounts are stored in browser LocalStorage:
- Check `localStorage.getItem("mymap_users")`
- Check `localStorage.getItem("mymap_auth")`

## Future Enhancements

- [ ] Social login (Google, GitHub)
- [ ] Password reset via email
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] User profiles with avatars
- [ ] Cloud sync of map data
- [ ] Shareable map links
- [ ] Premium features/subscriptions

## Migration to Production Auth

When ready to use real authentication:

1. **Install Auth Library**
   ```bash
   npm install next-auth
   # or
   npm install @supabase/supabase-js
   ```

2. **Update Store**
   - Remove localStorage logic
   - Use auth provider's session management

3. **Update Middleware**
   - Add proper token validation
   - Use auth provider's middleware

4. **Update Components**
   - Replace custom auth with provider hooks
   - Remove localStorage checks

---

**Current Status**: ✅ Fully functional with localStorage-based authentication  
**Production Ready**: ⚠️ Requires backend integration for security

