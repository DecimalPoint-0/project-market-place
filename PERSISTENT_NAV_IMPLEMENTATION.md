# Static Header & Navigation with Cached User Data - Implementation Summary

## What Was Changed

You now have a persistent header and navigation system with intelligent caching. Here's what was implemented:

### 1. **Enhanced Auth Store** (`src/store/auth.js`)
- User data is now automatically persisted to `localStorage`
- Added `lastFetchTime` tracking to monitor when data was last fetched
- Added `shouldRefreshUserData()` method that returns `true` if 30 minutes have passed
- User data loads from localStorage on app startup (instant profile availability)

### 2. **New User Refresh Hook** (`src/plugin/useUserRefresh.js`)
- Custom hook that manages the 30-minute refresh interval
- Checks every 5 minutes if 30 minutes have passed since last fetch
- Automatically refetches user data if the interval has passed
- Non-blocking - runs in background without user interaction

### 3. **Restructured App Layout** (`src/App.jsx`)
- Header (`AdminNavBar`) and navigation (`LeftNavBar`) now render at the App level, NOT in each page
- Only renders header/nav when on dashboard routes (`/dashboard/*`)
- Header/nav persist across all dashboard pages without reloading
- Separated dashboard routes into a dedicated `DashboardLayout` component
- Integrated `useUserRefresh` hook for automatic data refresh

### 4. **Updated Dashboard Components**
All dashboard pages (`Home.jsx`, `Profile.jsx`, `Wallet.jsx`, `Transactions.jsx`, `AddProjects.jsx`):
- Removed `AdminNavBar` and `LeftNavBar` imports (no longer needed locally)
- Removed redundant header/nav rendering from each page
- Updated layout from `flex-1 md:ml-64` to `w-full` (nav margin handled at App level)
- Use cached user data from `useAuthStore` when available

### 5. **MainWrapper Update** (`src/layouts/MainWrapper.jsx`)
- Maintains initial authentication check on app load
- Ensures user data is loaded from localStorage on refresh

## How It Works

### On Initial Load:
1. App loads from `localStorage` instantly if user was previously logged in
2. Header and navigation appear immediately
3. In background, `useUserRefresh` hook is initialized

### During Navigation:
1. User clicks between dashboard pages
2. Header and navigation DON'T reload - they persist
3. Each page uses cached user data from the store
4. No redundant API calls for user profile on every page visit

### Every 30 Minutes:
1. `useUserRefresh` detects that 30 minutes have passed
2. Automatically fetches fresh user data from backend
3. Updates `localStorage` with new data
4. All pages see the updated data via the store

### Manual Refresh (when user action required):
1. When user updates profile or performs actions, they directly update the store
2. You can call the refresh function returned by `useUserRefresh` if needed

## Benefits

✅ **Faster Navigation** - Header/nav don't reload between dashboard pages
✅ **Reduced API Calls** - User data isn't fetched on every page load
✅ **Persistent UI State** - Navigation state maintained across pages
✅ **Automatic Updates** - Data refreshes every 30 mins automatically
✅ **Offline Support** - User data available from localStorage even if connection drops temporarily
✅ **Better UX** - Smoother transitions, no loading spinners for navigation

## Configuration

To adjust the refresh interval, edit `src/plugin/useUserRefresh.js`:

```javascript
// Change this line (currently 30 minutes):
const thirtyMinutesInMs = 30 * 60 * 1000;

// To whatever interval you want (e.g., 15 minutes):
const fifteenMinutesInMs = 15 * 60 * 1000;
```

The refresh check runs every 5 minutes - to change check frequency:
```javascript
// This line (currently 5 minutes):
const interval = setInterval(() => {
    if (shouldRefresh()) {
        refreshUserData();
    }
}, 5 * 60 * 1000);
```

## Notes

- `localStorage` is cleared automatically when user logs out (via `setUser(null)`)
- All dashboard components still work normally - they just don't render header/nav locally
- The `useUserRefresh` hook is only active when on dashboard routes
- User data in localStorage is JSON-serialized for safe storage
