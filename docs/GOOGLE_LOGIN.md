# Google Login Setup

Direct Google OAuth (ID token) integrated with existing JWT auth. **Does not use Supabase Auth.**

## Architecture

1. User clicks **Google Login** on `/login`
2. Google Identity Services popup returns an **ID token**
3. Frontend `POST /api/auth/google` with `{ "idToken": "..." }`
4. Backend verifies the token with `google-auth-library` (`verifyIdToken`)
5. Backend finds or creates the user (account linking by email)
6. Backend issues the same JWT access token + httpOnly refresh cookie as email login

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services → OAuth consent screen**
   - User type: External (or Internal for Workspace)
   - App name: Elite Performance (or your brand)
   - Support email + developer contact
   - Scopes: `openid`, `email`, `profile` (default for Sign In With Google)
   - Add test users while the app is in Testing
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: Gym Website Web Client

### Authorized JavaScript origins

```
http://localhost:5173
http://localhost:5174
```

Add your production origin, e.g. `https://yourdomain.com`

### Authorized redirect URIs

For GIS popup ID-token flow these are often unused, but add for safety:

```
http://localhost:5173
http://localhost:5174
http://localhost:5173/login
http://localhost:5174/login
```

Add production URLs when deploying.

5. Copy the **Client ID** (ends with `.apps.googleusercontent.com`)

## 2. Environment

### `frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### `backend/.env`

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

Use the **same** Client ID on both sides (audience check).

## 3. Database

`User` includes:

| Field | Notes |
|--------|--------|
| `googleId` | Google `sub` (unique, optional) |
| `provider` | `EMAIL` \| `GOOGLE` \| `EMAIL_GOOGLE` (+ future providers) |
| `isVerified` | Email verified (`isEmailVerified` conceptually) |
| Avatar | Stored on `Profile.avatarUrl` |

Apply schema:

```bash
cd backend
npx prisma db push
```

## 4. Account linking

| Case | Behavior |
|------|----------|
| New Google user | Create user, `provider=GOOGLE`, `isVerified=true` |
| Existing email/password, same email | Link `googleId`, set `provider=EMAIL_GOOGLE` |
| Already linked Google ID | Login, issue JWT session |

No duplicate accounts for the same email.

## 5. Testing guide

1. Restart frontend and backend after setting env vars
2. Open `http://localhost:5174/login`
3. Click **Google Login** → choose account
4. Confirm redirect:
   - Staff roles → `/dashboard`
   - Member (`USER`) → `/profile` (existing routing)
5. Confirm Network:
   - `POST /api/auth/google` → **200**
   - Body includes `data.user` + `data.accessToken`
   - `refreshToken` cookie set on `/api/auth`
6. Log out, log in again with email/password — still works
7. Negative cases:
   - Missing `VITE_GOOGLE_CLIENT_ID` → clear error
   - Invalid `idToken` → 401
   - Suspended user → 403

## 6. Security notes

- Backend never trusts frontend profile claims
- Only Google **ID tokens** are accepted (signature, audience, issuer, expiry)
- Google access tokens are not stored
- Refresh tokens remain httpOnly cookies
- Existing rate limiting on `/api/auth` still applies
