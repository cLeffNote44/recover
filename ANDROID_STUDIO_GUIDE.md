# Complete Android Studio Setup & Deployment Guide

## 📱 Recovery Journey - Android Deployment

This guide will walk you through setting up Android Studio and deploying your app, step by step.

---

## ✅ **Step 1: Android Studio Initial Setup**

### **1.1 First Time Opening**

When Android Studio opens your project, you'll see several things happening:

1. **Project Indexing** (top right corner)
   - This scans all your files
   - Usually takes 1-2 minutes
   - You'll see a progress bar

2. **Gradle Sync** (bottom status bar)
   - Downloads project dependencies
   - Configures build tools
   - **IMPORTANT: Wait for this to complete!**
   - First time: 5-15 minutes (downloads ~500MB)
   - Message will say "Gradle sync finished" when done

### **1.2 What to Look For**

✅ **Success Messages:**
- "Gradle sync finished in X seconds"
- No red errors in the "Build" tab (bottom)

❌ **Error Messages:**
If you see errors, they're usually:
- Missing Android SDK components
- Wrong Java version
- Network issues

---

## 🔧 **Step 2: Configure Android SDK**

### **2.1 Check SDK Installation**

1. **Open SDK Manager:**
   - Click the **cube icon** in toolbar (or Tools → SDK Manager)

2. **SDK Platforms Tab:**
   - ✅ Check "Android 14.0 (API 34)" - TARGET
   - ✅ Check "Android 13.0 (API 33)"
   - ✅ Check "Android 5.1 (API 22)" - MINIMUM
   - Click "Apply" if any are unchecked

3. **SDK Tools Tab:**
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (if on Intel CPU)
   - Click "Apply" to install

4. **Click OK** and wait for downloads to complete

### **2.2 Set Java/JDK Version**

1. **File → Project Structure** (or Ctrl+Alt+Shift+S)
2. **SDK Location** tab on left
3. Check "JDK location" shows Java 11 or higher
4. If not set:
   - Click "..." button
   - Select **JDK 11** or **JDK 17** folder
   - Common locations:
     - `C:\Program Files\Android\jdk`
     - `C:\Program Files\Java\jdk-11`

---

## 📱 **Step 3: Set Up Testing Device**

You have two options: Physical device or Emulator

### **Option A: Physical Android Phone** (Recommended - Faster)

#### **3.1 Enable Developer Mode on Phone**

1. **Go to phone Settings**
2. **About Phone** (or "About device")
3. **Find "Build Number"** (might be under "Software Information")
4. **Tap "Build Number" 7 times** rapidly
5. You'll see "You are now a developer!" message

#### **3.2 Enable USB Debugging**

1. **Go back to main Settings**
2. **Find "Developer Options"** (usually near bottom)
3. **Toggle it ON**
4. **Scroll down to "USB Debugging"**
5. **Toggle it ON**
6. Tap "OK" on warning

#### **3.3 Connect to Computer**

1. **Connect phone via USB cable**
2. **Phone will show popup:** "Allow USB debugging?"
3. **Check "Always allow from this computer"**
4. **Tap "Allow"**

#### **3.4 Verify Connection in Android Studio**

1. Look at **device dropdown** (top toolbar)
2. You should see your phone model (e.g., "Samsung Galaxy S21")
3. If not showing:
   - Try different USB cable
   - Install phone manufacturer's USB driver
   - Restart Android Studio

---

### **Option B: Android Emulator** (Slower but no phone needed)

#### **3.1 Open Device Manager**

1. Click the **phone icon** in right toolbar
2. Or **Tools → Device Manager**

#### **3.2 Create Virtual Device**

1. Click **"Create Device"** button
2. **Select Hardware:**
   - Choose "Phone" category
   - Select **"Pixel 6"** or **"Pixel 7"**
   - Click "Next"

3. **Select System Image:**
   - Choose **"Tiramisu" (API 33)** or **"UpsideDownCake" (API 34)**
   - Click the "Download" link next to it
   - Wait for download (~1-2GB)
   - Click "Next"

4. **Verify Configuration:**
   - Leave settings as default
   - Click "Finish"

#### **3.3 Start Emulator**

1. In Device Manager, click **▶️ (Play button)** next to your emulator
2. Wait for emulator to boot (first time: 2-5 minutes)
3. You'll see an Android phone screen appear

---

## 🔨 **Step 4: Build and Run the App**

### **4.1 First Build (Debug Version)**

1. **Make sure Gradle sync is complete** (check bottom status bar)

2. **Select your device:**
   - Click the device dropdown (top toolbar)
   - Select your phone or emulator

3. **Click the green Play button** ▶️ (or press Shift+F10)

4. **Wait for build:**
   - First build: 2-5 minutes
   - You'll see progress in "Build" tab at bottom
   - Messages like "Task :app:compileDebugJava"

5. **Watch for "BUILD SUCCESSFUL"**

6. **App will install and launch automatically**

### **4.2 Troubleshooting First Build**

**If build fails:**

1. **Check "Build" tab** at bottom for error message

2. **Common errors:**

   **"SDK location not found"**
   - Fix: File → Project Structure → SDK Location
   - Set Android SDK path

   **"Failed to install the following Android SDK packages"**
   - Fix: Tools → SDK Manager → Install missing packages

   **"Gradle sync failed"**
   - Fix: File → Invalidate Caches → Invalidate and Restart

   **"Could not find com.android..."**
   - Fix: Check internet connection, retry sync

3. **Try cleaning:**
   - Build → Clean Project
   - Build → Rebuild Project

---

## 🎨 **Step 5: Customize App (Optional)**

### **5.1 Change App Name**

File: `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">Recovery Journey</string>
    <string name="title_activity_main">Recovery Journey</string>
    <string name="package_name">com.recovery.journey</string>
    <string name="custom_url_scheme">com.recovery.journey</string>
</resources>
```

Change "Recovery Journey" to whatever you want.

### **5.2 Change Version Number**

File: `android/app/build.gradle`

```gradle
defaultConfig {
    versionCode 2        // Increment this for each release
    versionName "1.1"    // Your display version
}
```

### **5.3 Change App Icon**

**Quick method:**
```bash
# In terminal, from source/ folder
npm install -g @capacitor/assets
npx capacitor-assets generate --android
```

This auto-generates all icon sizes from your 512x512 icon.

---

## 📦 **Step 6: Generate APK for Sharing**

### **6.1 Build Signed APK**

1. **Build → Generate Signed Bundle / APK**

2. **Select "APK"** → Next

3. **Create Keystore** (first time only):

   a. Click "Create new..."

   b. **Key store path:**
      - Click folder icon
      - Navigate to a safe location (e.g., Documents)
      - Name it: `recovery-journey-keystore.jks`

   c. **Fill in details:**
      - Password: (create strong password - WRITE THIS DOWN!)
      - Confirm password
      - Alias: `recovery-journey-key`
      - Alias password: (same as above)
      - Validity: 25 years (default is fine)
      - First and Last Name: Your name
      - Organization: Your name/company
      - City, State, Country: Your location

   d. Click "OK"

4. **Remember passwords:**
   ⚠️ **CRITICAL:** Save these passwords somewhere safe!
   - You'll need them for every app update
   - If you lose them, you can't update your app

5. **Select build variant:**
   - Choose **"release"**
   - Click "Next"

6. **Signature Versions:**
   - ✅ Check "V1 (Jar Signature)"
   - ✅ Check "V2 (Full APK Signature)"
   - Click "Finish"

7. **Wait for build** (1-3 minutes)

8. **Find your APK:**
   - Message appears: "APK(s) generated successfully"
   - Click "locate" link
   - File location: `android/app/release/app-release.apk`

### **6.2 Using the APK**

**To install on your phone:**
1. Copy APK to your phone
2. Open file manager
3. Tap the APK
4. Allow "Install unknown apps" if prompted
5. Tap "Install"

**To share with others:**
- Send the APK file via email, Google Drive, etc.
- They follow same installation steps

---

## 🏪 **Step 7: Prepare for Google Play Store** (Optional)

### **7.1 Generate App Bundle (AAB)**

Google Play requires AAB format (not APK).

1. **Build → Generate Signed Bundle / APK**
2. Select **"Android App Bundle"**
3. Use same keystore as before
4. Select **"release"**
5. Click "Finish"

**Output:** `android/app/release/app-release.aab`

### **7.2 Google Play Console Setup**

1. **Create account:**
   - Go to [play.google.com/console](https://play.google.com/console)
   - Sign up ($25 one-time fee)

2. **Create new app:**
   - Click "Create app"
   - App name: Recovery Journey
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Check declarations and create

3. **Set up app:**
   - **Dashboard** will show required tasks
   - Complete each section:
     - App content (privacy policy, etc.)
     - Store listing (description, screenshots)
     - Content rating
     - Target audience
     - News app
     - COVID-19 contact tracing
     - Data safety

4. **Upload AAB:**
   - Production → Create new release
   - Upload your AAB file
   - Add release notes
   - Review and rollout

5. **Submit for review:**
   - Google reviews in 1-7 days
   - You'll get email when approved

---

## 🔍 **Step 8: Testing & Debugging**

### **8.1 View Logs (Logcat)**

1. **Click "Logcat" tab** at bottom
2. **Filter by:**
   - Package: `com.recovery.journey`
   - Log level: Debug, Info, Warn, Error

3. **Look for errors** if app crashes

### **8.2 Debug JavaScript/Web Code**

Your app is a web view, so you can debug like a website:

1. **Open Chrome browser** on your computer
2. **Type in address bar:** `chrome://inspect`
3. **Wait for your device** to appear
4. **Click "inspect"** under your app
5. **Chrome DevTools opens** - use like regular web debugging

### **8.3 Test on Multiple Devices**

Create emulators for:
- Different screen sizes (phone, tablet)
- Different Android versions (API 22, 28, 33)
- Different manufacturers (Pixel, Samsung)

---

## ⚙️ **Common Tasks Reference**

### **Clean Build**
When things get weird:
```
Build → Clean Project
Build → Rebuild Project
```

### **Update App After Code Changes**
```bash
# In terminal:
cd source
npm run build
npx cap sync android

# Then in Android Studio:
Click Run ▶️
```

### **Uninstall App from Device**
- Long press app icon → App info → Uninstall
- Or in Android Studio: Run → Edit Configurations → Before launch → Remove app

### **Change Build Variant**
- View → Tool Windows → Build Variants
- Select "debug" or "release"

---

## 📊 **Build Variants Explained**

| Variant | Purpose | Size | Speed | Debuggable |
|---------|---------|------|-------|------------|
| **debug** | Development/testing | Larger | Slower | Yes |
| **release** | Production | Smaller | Faster | No |

Always test **release** builds before publishing!

---

## 🐛 **Troubleshooting Guide**

### **Problem: Gradle Sync Never Completes**

**Solutions:**
1. Check internet connection
2. File → Invalidate Caches → Invalidate and Restart
3. Delete `.gradle` folder in project, restart Android Studio
4. Tools → SDK Manager → Check for updates

### **Problem: App Won't Install on Phone**

**Solutions:**
1. Uninstall old version first
2. Enable "Install unknown apps" in phone settings
3. Check phone storage (need ~100MB free)
4. Try different USB cable

### **Problem: Emulator Too Slow**

**Solutions:**
1. Tools → AVD Manager → Edit emulator
2. Reduce RAM (2GB is enough)
3. Enable Hardware acceleration:
   - Install HAXM (Intel) or Hyper-V (Windows)
4. Use x86 system images (not ARM)

### **Problem: "Could not find Android SDK"**

**Solutions:**
1. File → Project Structure
2. SDK Location tab
3. Android SDK Location: should be set
   - Windows: `C:\Users\YourName\AppData\Local\Android\Sdk`
   - If not, install Android SDK via Android Studio

### **Problem: Build Successful but App Crashes**

**Solutions:**
1. Check Logcat for errors
2. Make sure web build is up to date: `npm run build`
3. Sync Capacitor: `npx cap sync android`
4. Clean and rebuild

---

## 📋 **Quick Command Reference**

### **Update app code:**
```bash
npm run build
npx cap sync android
```

### **Open Android Studio:**
```bash
npx cap open android
```

### **Check Capacitor:**
```bash
npx cap doctor android
```

### **Add new plugin:**
```bash
npm install @capacitor/camera
npx cap sync android
```

---

## 🎯 **Next Steps Checklist**

- [ ] Android Studio opened successfully
- [ ] Gradle sync completed
- [ ] SDK configured (API 22-34)
- [ ] Device connected (emulator or phone)
- [ ] App builds and runs
- [ ] App tested on device
- [ ] Signed APK generated
- [ ] App icon customized (optional)
- [ ] Ready for distribution!

---

## 📞 **Getting Help**

**If stuck:**
1. Check the "Build" tab for specific error messages
2. Google the exact error message
3. Check Stack Overflow
4. Capacitor docs: [capacitorjs.com/docs/android](https://capacitorjs.com/docs/android)
5. Android docs: [developer.android.com](https://developer.android.com)

---

## ✅ **Success!**

Once you see your app running on your device with no errors, you're done! 🎉

Your Recovery Journey app is now:
- ✅ Built for Android
- ✅ Installable on devices
- ✅ Ready to share (APK)
- ✅ Ready for Play Store (AAB)

**Congratulations!** 🚀
