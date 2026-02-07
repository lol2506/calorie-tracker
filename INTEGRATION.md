# Frontend-Backend Integration Guide

This document explains how to integrate the Next.js frontend with your deployed FastAPI backend.

## 📁 New/Modified Files

### New Files
- `frontend/lib/api.ts` - API client with all backend endpoints

### Modified Files  
- `frontend/lib/store.ts` - Zustand store with authentication and backend data
- `frontend/app/page.tsx` - Added auth screen and auth check on load
- `frontend/components/screens/auth-screen.tsx` - Login/Register component
- `frontend/components/screens/add-food-screen.tsx` - Backend food search and meal logging
- `frontend/components/screens/home-screen.tsx` - Shows backend meals with delete
- `frontend/components/screens/profile-screen.tsx` - Shows email and logout button

---

## 🚀 Deployment Steps

### Step 1: Set Environment Variable on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://calorie-tracker-api-tvbf.onrender.com`
4. Click **Save**

### Step 2: Commit and Push Changes

```bash
cd frontend
git add .
git commit -m "Add backend integration with authentication"
git push origin main
```

### Step 3: Trigger Redeploy on Vercel

Vercel should automatically redeploy when you push. If not:
1. Go to your Vercel project
2. Click **Deployments** tab
3. Click the "..." menu on the latest deployment
4. Select **Redeploy**

---

## 🔄 How the Integration Works

### Authentication Flow
1. User opens app → Checks for stored JWT token
2. If no token → Shows login/register screen
3. User logs in → Token stored in localStorage
4. App loads user data from backend

### Data Flow
1. **Foods**: Fetched from `/foods` endpoint (51 Indian foods)
2. **Meals**: Logged via `/meals` endpoint
3. **Stats**: Today's nutrition from `/meals/stats/today`
4. **All data synced with backend** - not stored locally

### State Management
- **Authentication**: Token in localStorage, email in Zustand
- **Foods**: Fetched from API, stored in `backendFoods`
- **Meals**: Fetched from API, converted to `todayEntries`
- **Stats**: Fetched from API, stored in `todayStats`

---

## 🧪 Testing the Integration

### 1. Local Testing

```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

### 2. Test Authentication
1. Open the app → Should see login screen
2. Click "Register" tab
3. Create account with:
   - Email: `test@example.com`
   - Password: `test123`
   - Daily goal: `2000`
4. Should redirect to onboarding

### 3. Test Food Search
1. Complete onboarding → Go to home
2. Click "+" on any meal
3. Should see 51 Indian foods loading
4. Search for "paneer" → Should filter results
5. Click a food → Quantity modal appears
6. Add to meal → Returns to home with meal logged

### 4. Test Meal Management
1. On home screen, see logged meals
2. Hover over an entry → Delete icon appears
3. Click delete → Meal removed from backend

### 5. Test Logout
1. Go to Profile tab
2. Click "Sign Out"
3. Should return to login screen
4. Token cleared from localStorage

---

## 🔧 Troubleshooting

### "Failed to load foods" Error
- Check if backend is running: Visit https://calorie-tracker-api-tvbf.onrender.com/docs
- Backend on Render may spin down after inactivity - wait 30 seconds and retry

### "Login failed" Error
- Verify email format is correct
- Password must be at least 6 characters
- User may not exist - try registering first

### CORS Errors
- Backend should have CORS enabled for your Vercel domain
- If not, update backend `main.py` to allow your frontend URL

### Token Issues
1. Open browser DevTools → Application → Local Storage
2. Look for `calorie_tracker_token`
3. Delete it to force re-authentication

---

## 📝 Environment Variables Summary

| Variable | Value | Where |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://calorie-tracker-api-tvbf.onrender.com` | Vercel Dashboard |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│                  (Vercel Deployment)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  AuthScreen  │    │  HomeScreen  │    │ AddFoodScreen│  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                    ┌────────┴────────┐                      │
│                    │  Zustand Store  │                      │
│                    │   (store.ts)    │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│                    ┌────────┴────────┐                      │
│                    │   API Client    │                      │
│                    │    (api.ts)     │                      │
│                    └────────┬────────┘                      │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                             │                               │
│              FastAPI Backend (Render)                       │
│        https://calorie-tracker-api-tvbf.onrender.com       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  /auth   │  │  /foods  │  │  /meals  │  │ /users   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│                    ┌────────────────┐                       │
│                    │   PostgreSQL   │                       │
│                    │   (51 Foods)   │                       │
│                    └────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Environment variable set on Vercel
- [ ] Changes committed and pushed
- [ ] Vercel redeployed
- [ ] Login/Register works
- [ ] Foods load from database
- [ ] Meals can be added
- [ ] Meals can be deleted
- [ ] Logout clears session
