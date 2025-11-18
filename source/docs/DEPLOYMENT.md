# Deployment Guide

> Instructions for deploying Recovery Journey to various platforms

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building for Production](#building-for-production)
3. [Web Deployment](#web-deployment)
4. [Mobile Deployment](#mobile-deployment)
5. [Environment Variables](#environment-variables)
6. [CI/CD](#cicd)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 10.4.1+ (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))

### Optional (for mobile)
- **Xcode** 15+ (macOS only, for iOS builds)
- **Android Studio** (for Android builds)
- **Capacitor CLI** (`npm install -g @capacitor/cli`)

### Required Accounts
- **GitHub** (source control)
- **Vercel** (web hosting - free tier available)
- **Apple Developer** ($99/year - for iOS App Store)
- **Google Play Console** ($25 one-time - for Android)

---

## Building for Production

### Web Build

```bash
# Navigate to source directory
cd source

# Install dependencies
pnpm install

# Build for production
pnpm build
```

**Output:** `dist/` folder containing optimized static files

**Build Stats:**
- Total size: ~2MB (compressed)
- Initial load: ~300KB
- Chunks split for optimal caching

### Build Optimization

The build process automatically:
- **Minifies** JavaScript and CSS
- **Tree-shakes** unused code
- **Code splits** routes and large dependencies
- **Compresses** with gzip/brotli
- **Optimizes** images
- **Generates** service worker for offline support

---

## Web Deployment

### Vercel (Recommended)

**Why Vercel:**
- Zero configuration
- Automatic deployments
- Global CDN
- Preview deployments for PRs
- Free for personal projects
- Excellent performance

#### Initial Setup

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd source
vercel --prod
```

4. **Follow Prompts:**
- Link to existing project or create new
- Confirm project settings
- Wait for deployment

**Result:** Your app is live at `https://your-project.vercel.app`

#### Configuration

The project includes `vercel.json`:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Custom Domain

1. Go to Vercel dashboard
2. Select your project
3. Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

#### Environment Variables

In Vercel dashboard:
1. Project Settings > Environment Variables
2. Add variables (see [Environment Variables](#environment-variables))
3. Redeploy to apply

#### Automatic Deployments

**Production:**
- Every push to `main` branch
- Deploys to production URL

**Preview:**
- Every pull request
- Unique preview URL per PR
- Perfect for testing before merge

### Netlify

**Alternative to Vercel:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd source
netlify deploy --prod
```

**Configuration:** Create `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS S3 + CloudFront

**For enterprise/self-hosted:**

1. **Build the app:**
```bash
pnpm build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://recovery-journey-app
```

3. **Enable static website hosting:**
```bash
aws s3 website s3://recovery-journey-app/ \
  --index-document index.html \
  --error-document index.html
```

4. **Upload files:**
```bash
aws s3 sync dist/ s3://recovery-journey-app/ \
  --delete \
  --cache-control max-age=31536000,public
```

5. **Create CloudFront distribution:**
- Origin: S3 bucket
- Viewer protocol: Redirect HTTP to HTTPS
- Custom error: 404 -> /index.html (200)
- Enable compression

6. **Add custom domain (optional):**
- Add CNAME record
- Request SSL certificate in ACM
- Attach to CloudFront

### Docker (Self-Hosted)

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Enable gzip
  gzip on;
  gzip_types text/css application/javascript application/json;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
}
```

**Build and run:**

```bash
# Build image
docker build -t recovery-journey .

# Run container
docker run -d -p 80:80 recovery-journey
```

---

## Mobile Deployment

### iOS App Store

#### Prerequisites
- macOS with Xcode 15+
- Apple Developer account ($99/year)
- Enrolled in Apple Developer Program

#### Setup

1. **Sync Capacitor:**
```bash
cd source
npx cap sync ios
```

2. **Open in Xcode:**
```bash
npx cap open ios
```

3. **Configure in Xcode:**
- Select project in navigator
- General tab:
  - Bundle Identifier: `com.yourcompany.recoveryjourney`
  - Version: `1.0.0`
  - Build: `1`
- Signing & Capabilities:
  - Select your team
  - Enable automatic signing
  - Add capabilities (Push Notifications, HealthKit, etc.)

4. **Build for Release:**
- Product > Archive
- Wait for archive to complete
- Distribute App > App Store Connect
- Upload to App Store

5. **App Store Connect:**
- Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- Create new app
- Fill in metadata:
  - Name
  - Subtitle
  - Description
  - Keywords
  - Screenshots (required sizes)
  - App icon
  - Privacy policy URL
- Submit for review

6. **Wait for Review:**
- Typical review time: 24-48 hours
- Monitor status in App Store Connect
- Respond to any feedback

#### App Store Assets

**Required Screenshots:**
- 6.5" Display (iPhone 14 Pro Max): 1284 × 2778
- 5.5" Display (iPhone 8 Plus): 1242 × 2208
- 12.9" Display (iPad Pro): 2048 × 2732

**App Icon:**
- 1024 × 1024 pixels
- No transparency
- No rounded corners (iOS adds them)

**Preview Video (Optional):**
- 15-30 seconds
- Demonstrates key features

### Android Google Play

#### Prerequisites
- Android Studio
- Google Play Console account ($25 one-time fee)

#### Setup

1. **Sync Capacitor:**
```bash
cd source
npx cap sync android
```

2. **Open in Android Studio:**
```bash
npx cap open android
```

3. **Configure:**
- Open `android/app/build.gradle`
- Set:
  - `applicationId`: `com.yourcompany.recoveryjourney`
  - `versionCode`: `1`
  - `versionName`: `"1.0.0"`

4. **Generate Signing Key:**
```bash
keytool -genkey -v -keystore recovery-journey.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias recovery-journey
```

5. **Configure Signing:**
- Create `android/key.properties`:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=recovery-journey
storeFile=../recovery-journey.jks
```

- Update `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

6. **Build Release APK/AAB:**
```bash
cd android
./gradlew bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

7. **Upload to Play Console:**
- Go to [play.google.com/console](https://play.google.com/console)
- Create new app
- Fill in store listing:
  - Title
  - Short description (80 chars)
  - Full description (4000 chars)
  - Screenshots (required sizes)
  - App icon
  - Feature graphic
  - Privacy policy
- Release > Production
- Upload AAB
- Submit for review

#### Play Store Assets

**Screenshots:**
- Phone: 1080 × 1920 (minimum 2 screenshots)
- 7" Tablet: 1200 × 1920
- 10" Tablet: 1920 × 1200

**Feature Graphic:**
- 1024 × 500 pixels

**App Icon:**
- 512 × 512 pixels
- PNG
- 32-bit with alpha

---

## Environment Variables

### Development

Create `.env.local`:

```bash
# Optional analytics (privacy-first)
VITE_ANALYTICS_ID=your_plausible_domain

# Optional error tracking
VITE_SENTRY_DSN=your_sentry_dsn

# Feature flags
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_TELEMETRY=false

# API endpoints (future)
VITE_API_URL=http://localhost:3000
```

### Production

**Vercel:**
- Set in dashboard under Project Settings > Environment Variables

**Netlify:**
- Set in dashboard under Site Settings > Build & Deploy > Environment

**Self-hosted:**
- Pass as Docker environment variables
- Or create `.env.production`

### Environment Variable List

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_ANALYTICS_ID` | Plausible Analytics domain | - | No |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | - | No |
| `VITE_API_URL` | Backend API URL (future) | - | No |
| `VITE_ENABLE_CLOUD_SYNC` | Enable cloud sync feature | `false` | No |

---

## CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.4.1

      - name: Install dependencies
        run: pnpm install
        working-directory: ./source

      - name: Build
        run: pnpm build
        working-directory: ./source

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./source
```

### Mobile CI/CD (Fastlane)

**iOS:**

```ruby
# fastlane/Fastfile
platform :ios do
  desc "Push to TestFlight"
  lane :beta do
    build_app(scheme: "RecoveryJourney")
    upload_to_testflight
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(scheme: "RecoveryJourney")
    upload_to_app_store
  end
end
```

**Android:**

```ruby
platform :android do
  desc "Deploy to Internal Testing"
  lane :internal do
    gradle(task: "bundleRelease")
    upload_to_play_store(
      track: 'internal',
      aab: 'app/build/outputs/bundle/release/app-release.aab'
    )
  end

  desc "Deploy to Production"
  lane :release do
    gradle(task: "bundleRelease")
    upload_to_play_store(
      track: 'production',
      aab: 'app/build/outputs/bundle/release/app-release.aab'
    )
  end
end
```

---

## Monitoring

### Performance Monitoring

**Web Vitals:**
```typescript
// src/lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking (Sentry)

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Privacy-Friendly Analytics (Plausible)

```html
<!-- public/index.html -->
<script defer data-domain="recoveryjourney.app"
  src="https://plausible.io/js/script.js"></script>
```

---

## Troubleshooting

### Build Errors

**Error:** `Module not found`
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error:** `Out of memory`
**Solution:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### Deployment Issues

**Issue:** White screen after deployment
**Cause:** Incorrect base path
**Solution:** Check `vite.config.ts` base path matches deployment URL

**Issue:** 404 on refresh
**Cause:** Server not configured for SPA
**Solution:** Ensure rewrites are set up (see platform-specific configs above)

### Mobile Build Issues

**iOS:** `Code signing failed`
**Solution:**
- Verify Apple Developer membership is active
- Regenerate certificates in Xcode

**Android:** `Duplicate resources`
**Solution:**
```bash
cd android
./gradlew clean
./gradlew build
```

### Performance Issues

**Slow initial load:**
- Check bundle size: `pnpm build --analyze`
- Lazy load heavy components
- Optimize images

**Slow runtime:**
- Check for unnecessary re-renders (React DevTools Profiler)
- Memoize expensive calculations
- Debounce frequent operations

---

## Rollback Procedure

### Vercel
1. Go to Vercel dashboard
2. Select project
3. Deployments tab
4. Find last working deployment
5. Click "..." > "Promote to Production"

### Manual
1. Checkout previous version:
```bash
git checkout <previous-commit-hash>
```

2. Deploy:
```bash
pnpm build
vercel --prod
```

3. Create hotfix branch if needed:
```bash
git checkout -b hotfix/critical-fix
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Build succeeds locally
- [ ] Tested in production mode (`pnpm preview`)
- [ ] Environment variables configured
- [ ] Privacy policy updated (if needed)
- [ ] Changelog updated

### Post-Deployment
- [ ] Site loads correctly
- [ ] Check-in flow works
- [ ] Data persists correctly
- [ ] Analytics tracking (if enabled)
- [ ] Error tracking configured
- [ ] Monitor for errors (first 24 hours)
- [ ] Announce to users (if major update)

---

## Support

**Deployment Issues:**
- 📧 Email: support@recoveryjourney.app
- 💬 GitHub Discussions
- 📖 Platform-specific docs:
  - [Vercel Docs](https://vercel.com/docs)
  - [Netlify Docs](https://docs.netlify.com/)
  - [Capacitor Docs](https://capacitorjs.com/docs)

---

*Last updated: November 2025*
