# Debug Android WebView - Step by Step

## Use Chrome DevTools to See What's Happening

### Step 1: Make Sure App is Running on Emulator
- The app should be open on your Android emulator right now

### Step 2: Open Chrome on Your Computer
1. Open **Google Chrome** browser (not in Android Studio)
2. In the address bar, type: `chrome://inspect`
3. Press Enter

### Step 3: Find Your App
You should see a list of devices. Look for:
- Your emulator name (e.g., "Pixel 6 API 33")
- Under it, you'll see "Recovery Journey" or "com.recovery.journey"
- Click **"inspect"** next to it

### Step 4: DevTools Opens
A new window opens showing:
- **Console** tab - JavaScript errors and logs
- **Elements** tab - HTML structure
- **Network** tab - Files being loaded

### Step 5: Check These Things

**A) Check Console Tab:**
- Are there any RED errors?
- Look for messages like:
  - "Failed to load resource"
  - "AppProvider" errors
  - "Cannot find module"
- Copy any error messages

**B) Check Network Tab:**
- Click the "Network" tab
- Reload the app (click Run in Android Studio again)
- Look for:
  - `index-Dnlf_dpt.css` - Did it load? Is it green (200)?
  - `index-C9P7lDe6.js` - Did it load? Is it green (200)?
- If any are RED (404), that's the problem!

**C) Check Elements Tab:**
- Click the "Elements" tab
- Look at the `<html>` tag
- Does it have `class="dark"`?
- Does it have `style="background-color: #1a1625;"`?
- Look at the `<body>` - what's inside `<div id="root">`?

### Step 6: Take Screenshots
Take screenshots of:
1. The Console tab (showing any errors)
2. The Network tab (showing what loaded)
3. The Elements tab (showing the HTML)

### Common Issues & Fixes

**If CSS shows 404 (not found):**
- Path issue - files not being served correctly
- Solution: Check Capacitor config

**If JavaScript shows errors:**
- Read the error message
- Often tells us exactly what's wrong

**If HTML doesn't have `class="dark"`:**
- Build didn't update properly
- Solution: Clean build

**If everything loads but still white:**
- CSS might not be applying
- Could be a Tailwind build issue

---

## Quick Commands to Try

If DevTools shows the files aren't loading:

```bash
# Clean everything and rebuild
cd "C:\Users\codyl\Warp Working Directory\recovery-journey-v5-FINAL\source"
rm -rf dist android
npm run build
npx cap add android
npx cap sync android
```

Then rebuild in Android Studio.
