# Architecture Documentation

> Technical architecture and design decisions for Recovery Journey

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [State Management](#state-management)
4. [Data Flow](#data-flow)
5. [Storage Strategy](#storage-strategy)
6. [Mobile Architecture](#mobile-architecture)
7. [Security Architecture](#security-architecture)
8. [Performance Optimization](#performance-optimization)
9. [Design Patterns](#design-patterns)
10. [Future Architecture](#future-architecture)

---

## System Overview

Recovery Journey is built as a **privacy-first, offline-first Progressive Web App** with native mobile capabilities through Capacitor.

### Core Principles

**1. Privacy First**
- All data stored locally by default
- No telemetry or tracking
- Optional encrypted cloud sync
- User owns their data

**2. Offline First**
- Full functionality without internet
- Local data persistence
- Service worker caching
- Background sync when online

**3. Mobile First**
- Touch-optimized interface
- Responsive design
- Native app performance
- Platform-specific features

**4. Performance**
- Fast initial load
- Smooth animations
- Efficient re-renders
- Code splitting

### Technology Stack

**Frontend Framework:**
- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.21 (build tool)

**UI/UX:**
- Tailwind CSS 4.1.17
- Radix UI (accessible components)
- Framer Motion (animations)
- Lucide React (icons)

**Data Visualization:**
- Recharts 2.15.4
- Custom D3-based charts

**Mobile:**
- Capacitor 7.4.4
- Platform-specific APIs
- Native plugins

**State & Data:**
- React Context API
- localStorage API
- IndexedDB (planned)

---

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── app/                    # Application components
│   │   ├── screens/           # Full-screen views
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   ├── JournalScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── prevention/        # Relapse prevention
│   │   │   ├── TrafficLightScreen.tsx
│   │   │   └── RelapsePlanManager.tsx
│   │   ├── skills/            # Recovery skills
│   │   │   ├── SkillsScreen.tsx
│   │   │   └── SkillPractice.tsx
│   │   ├── StatCard.tsx       # Shared stat display
│   │   ├── RiskPredictionCard.tsx
│   │   └── ...
│   └── ui/                     # Reusable UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── contexts/
│   └── AppContext.tsx          # Global state
├── lib/                        # Business logic
│   ├── utils-app.ts           # Recovery calculations
│   ├── badges.ts              # Badge system
│   ├── relapse-risk-prediction.ts
│   ├── notifications.ts
│   ├── biometric-auth.ts
│   ├── widgets.ts
│   └── ...
├── types/
│   └── app.ts                  # TypeScript definitions
└── App.tsx                     # Root component
```

### Component Design Pattern

**Smart vs. Presentational Components:**

```typescript
// Smart Component (Screen)
export function HomeScreen() {
  const context = useAppContext(); // State access
  const daysSober = useMemo(() => calculateDaysSober(context.sobrietyDate), [context.sobrietyDate]);

  return (
    <div>
      <StatCard value={daysSober} label="Days Sober" />
    </div>
  );
}

// Presentational Component
interface StatCardProps {
  value: number;
  label: string;
  icon?: React.ComponentType;
}

export function StatCard({ value, label, icon: Icon }: StatCardProps) {
  return (
    <Card>
      {Icon && <Icon />}
      <div>{value}</div>
      <div>{label}</div>
    </Card>
  );
}
```

### Routing

**Wouter** for lightweight client-side routing:

```typescript
<Router>
  <Route path="/" component={HomeScreen} />
  <Route path="/analytics" component={AnalyticsScreen} />
  <Route path="/journal" component={JournalScreen} />
  <Route path="/skills" component={SkillsScreen} />
</Router>
```

### Bottom Navigation

Tab-based navigation for mobile UX:

```typescript
const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/prevention', icon: Shield, label: 'Prevention' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];
```

---

## State Management

### Context-Based Architecture

**AppContext** is the single source of truth for all application state.

```typescript
interface AppContextType {
  // Recovery Data
  sobrietyDate: string;
  checkIns: CheckIn[];
  meditations: Meditation[];
  cravings: Craving[];
  meetings: Meeting[];
  gratitude: Gratitude[];

  // Setters
  setSobrietyDate: (date: string) => void;
  setCheckIns: (checkIns: CheckIn[]) => void;
  // ... all setters

  // Computed
  currentQuote: Quote;
  loading: boolean;

  // Actions
  refreshData: () => Promise<void>;
  refreshQuote: () => void;
}
```

### State Persistence

```typescript
useEffect(() => {
  if (!loading) {
    const dataToSave: AppData = {
      sobrietyDate,
      checkIns,
      meditations,
      // ... all state
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }
}, [sobrietyDate, checkIns, meditations, /* all dependencies */]);
```

**Why Context over Redux:**
- Simpler mental model
- Less boilerplate
- Built into React
- Sufficient for our needs
- Better TypeScript integration

### Optimizations

**Memoization** to prevent unnecessary recalculations:

```typescript
const daysSober = useMemo(
  () => calculateDaysSober(sobrietyDate),
  [sobrietyDate]
);

const streak = useMemo(
  () => calculateStreak(checkIns),
  [checkIns]
);
```

---

## Data Flow

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler
    ↓
Context Setter (setSobrietyDate, setCheckIns, etc.)
    ↓
State Update
    ↓
localStorage Persistence
    ↓
Component Re-render
    ↓
UI Update
```

### Example: Daily Check-In Flow

```typescript
// 1. User fills out check-in form
const [mood, setMood] = useState<number | null>(null);
const [notes, setNotes] = useState('');

// 2. User submits
const handleCheckIn = () => {
  const newCheckIn = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    mood,
    notes
  };

  // 3. Update context
  setCheckIns([...checkIns, newCheckIn]);

  // 4. Context automatically persists to localStorage
  // 5. UI updates with new check-in
};
```

---

## Storage Strategy

### Current: localStorage

**Why localStorage:**
- Simple API
- Synchronous
- Widely supported
- Sufficient for current needs
- 5-10MB limit (enough for years of data)

**Data Structure:**

```json
{
  "sobrietyDate": "2024-01-01",
  "checkIns": [
    {
      "id": 1234567890,
      "date": "2024-11-17",
      "mood": 4,
      "notes": "Feeling strong today",
      "halt": { "hungry": 2, "angry": 1, "lonely": 1, "tired": 3 }
    }
  ],
  "meditations": [...],
  "cravings": [...],
  "settings": {...}
}
```

### Future: IndexedDB

**Planned Migration:**
- Larger storage capacity
- Better performance for large datasets
- Structured queries
- Transaction support

**Library:** Dexie.js (IndexedDB wrapper)

```typescript
// Future implementation
import Dexie from 'dexie';

const db = new Dexie('RecoveryJourney');
db.version(1).stores({
  checkIns: '++id, date, mood',
  meditations: '++id, date, duration',
  cravings: '++id, date, intensity'
});
```

### Cloud Sync (Planned)

**Architecture:**

```
Local Storage
    ↕ (Bidirectional Sync)
Encrypted Cloud Storage (AWS S3 / Supabase)
```

**Conflict Resolution:**
- Last-write-wins for simple fields
- Array merging for collections
- Timestamp-based resolution
- Manual resolution UI for conflicts

---

## Mobile Architecture

### Capacitor Integration

**Why Capacitor:**
- Write once, run everywhere
- Uses standard web technologies
- Native plugin access
- No vendor lock-in
- Can eject to native if needed

### Platform Detection

```typescript
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'
```

### Native Features

**Biometric Authentication:**

```typescript
// Dynamic import for tree-shaking
if (isNative) {
  const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
  await BiometricAuth.authenticate({
    reason: 'Authenticate to unlock Recovery Journey'
  });
}
```

**Local Notifications:**

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

await LocalNotifications.schedule({
  notifications: [
    {
      id: 1,
      title: 'Daily Check-In Reminder',
      body: "Don't forget your daily check-in!",
      schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) }
    }
  ]
});
```

**Home Screen Widgets (iOS/Android):**

```typescript
// Widget data generation
export function generateWidgetData(appData: AppData) {
  return {
    streak: calculateStreak(appData.checkIns),
    daysSober: calculateDaysSober(appData.sobrietyDate),
    todayQuote: appData.currentQuote.text,
    lastUpdate: new Date().toISOString()
  };
}
```

### Build Process

**Web Build:**
```bash
pnpm build
# Output: dist/
```

**iOS Build:**
```bash
npx cap sync ios
npx cap open ios
# Build in Xcode
```

**Android Build:**
```bash
npx cap sync android
npx cap open android
# Build in Android Studio
```

---

## Security Architecture

### Current Security Measures

**1. Local Encryption**
- Biometric-protected PIN storage
- Hashed PINs (not plaintext)
- Encrypted sensitive fields (planned)

**2. Input Validation**
- XSS prevention via React's built-in escaping
- Input sanitization for user-generated content
- Type checking via TypeScript

**3. Secure Communication**
- HTTPS-only
- No third-party scripts
- Subresource Integrity (SRI) for CDN assets

**4. Privacy Protection**
- No analytics or tracking
- No external API calls (except opt-in cloud sync)
- Service worker caching prevents CDN tracking

### Planned Security Enhancements

**Field-Level Encryption:**

```typescript
// Encrypt journal entries
import { encrypt, decrypt } from './encryption';

const encryptedEntry = encrypt(journalText, userKey);
localStorage.setItem('journal_entry', encryptedEntry);

const decrypted = decrypt(encryptedEntry, userKey);
```

**Secure Key Management:**
- Derive encryption key from PIN
- Use Web Crypto API
- Hardware-backed keys on mobile (Keychain/Keystore)

---

## Performance Optimization

### Code Splitting

**Route-based Splitting:**

```typescript
import { lazy, Suspense } from 'react';

const AnalyticsScreen = lazy(() => import('./screens/AnalyticsScreen'));

<Suspense fallback={<LoadingSkeleton />}>
  <AnalyticsScreen />
</Suspense>
```

**Bundle Analysis:**
- `recharts`: 552KB (largest chunk)
- `pdf-export`: 590KB
- Solution: Lazy load on demand

### Render Optimization

**useMemo for Expensive Calculations:**

```typescript
const badgeProgress = useMemo(() =>
  calculateBadgeProgress({
    sobrietyDate,
    checkIns,
    meditations,
    meetings,
    cravings
  }),
  [sobrietyDate, checkIns, meditations, meetings, cravings]
);
```

**useCallback for Stable Functions:**

```typescript
const handleCheckIn = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

**React.memo for Pure Components:**

```typescript
export const StatCard = React.memo(({ value, label }: StatCardProps) => {
  return <Card>...</Card>;
});
```

### Image Optimization

- SVG icons (Lucide) for scalability
- Optimized PNG for logos
- Lazy loading for images
- WebP format with fallback

### Service Worker Caching

```javascript
// Cache static assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses (for future cloud sync)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst()
);
```

---

## Design Patterns

### Container/Presentational Pattern

**Container (Smart):**
- Manages state
- Handles business logic
- Connects to context

**Presentational (Dumb):**
- Receives props
- Renders UI
- Fires callbacks

### Custom Hooks Pattern

```typescript
// useAppData.ts
export function useAppData() {
  const context = useAppContext();

  const daysSober = useMemo(
    () => calculateDaysSober(context.sobrietyDate),
    [context.sobrietyDate]
  );

  return { daysSober, ...context };
}

// Usage
function HomeScreen() {
  const { daysSober, streak } = useAppData();
  return <div>{daysSober}</div>;
}
```

### Compound Components

```typescript
// Card compound component
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Render Props (Limited Use)

Used sparingly, prefer hooks:

```typescript
<DataProvider>
  {(data) => <Display data={data} />}
</DataProvider>
```

---

## Future Architecture

### GraphQL API (Planned)

**Why GraphQL:**
- Request exactly the data needed
- Reduce over-fetching
- Strong typing
- Real-time subscriptions

**Example Query:**

```graphql
query GetUserProgress {
  user {
    sobrietyDate
    checkIns(last: 30) {
      date
      mood
      notes
    }
    badges {
      id
      name
      unlockedAt
    }
  }
}
```

### Real-Time Collaboration

**For group therapy and facility features:**

```typescript
// WebSocket connection
const ws = new WebSocket('wss://api.recoveryjourney.app/ws');

// Real-time updates
ws.on('message', (update) => {
  if (update.type === 'group_message') {
    addMessageToGroup(update.data);
  }
});
```

### Microservices (Enterprise)

**Service Decomposition:**
- Auth Service
- Patient Service
- Clinical Service
- Billing Service
- Analytics Service

**Communication:**
- REST APIs
- GraphQL gateway
- Message queues (RabbitMQ)

### Event Sourcing

**For audit trails and compliance:**

```typescript
// Event log
const events = [
  { type: 'CheckInCreated', timestamp: '...', data: {...} },
  { type: 'MoodUpdated', timestamp: '...', data: {...} },
  { type: 'JournalEntryCreated', timestamp: '...', data: {...} }
];

// Replay events to reconstruct state
const currentState = events.reduce(reducer, initialState);
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload)
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

**TypeScript Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**ESLint + Prettier:**
- Consistent code style
- Catch common errors
- Auto-formatting

**Git Hooks:**
- Pre-commit: Lint and type check
- Pre-push: Run tests

---

## Deployment Architecture

### Static Hosting (Vercel)

```
Git Push
    ↓
Vercel Build
    ↓
Deploy to CDN
    ↓
Instant Global Availability
```

**Benefits:**
- Automatic deployments
- Preview deployments for PRs
- Edge caching
- Custom domains
- Zero configuration

### Alternative Hosting

**Netlify:**
- Similar to Vercel
- Built-in forms (for waitlist)
- Split testing

**AWS S3 + CloudFront:**
- Full control
- Lower cost at scale
- More configuration required

**Self-Hosted:**
- For enterprise customers
- Docker container
- NGINX reverse proxy
- Let's Encrypt SSL

---

## Monitoring & Observability

### Current

**Browser DevTools:**
- Console logging
- Performance profiling
- Network inspection

**User Feedback:**
- In-app feedback form
- GitHub Issues
- Email support

### Planned

**Error Tracking:**
- Sentry for error reporting
- Source maps for debugging
- User session replay

**Analytics (Privacy-Respectful):**
- Plausible Analytics (no cookies, GDPR-compliant)
- Aggregate usage metrics
- Feature adoption tracking
- Performance monitoring

**Performance Monitoring:**
- Web Vitals tracking
- Lighthouse CI in build pipeline
- Real User Monitoring (RUM)

---

## Testing Strategy

### Current Testing

**Manual Testing:**
- Cross-browser testing
- Mobile device testing
- Accessibility testing

### Planned Testing

**Unit Tests:**
```typescript
// utils-app.test.ts
test('calculateDaysSober returns correct days', () => {
  const sobrietyDate = '2024-01-01';
  const days = calculateDaysSober(sobrietyDate);
  expect(days).toBeGreaterThan(0);
});
```

**Integration Tests:**
```typescript
// checkIn.test.tsx
test('creating a check-in updates streak', async () => {
  render(<HomeScreen />);
  await userEvent.click(screen.getByText('Check In Now'));
  // ... test flow
});
```

**E2E Tests (Playwright):**
```typescript
test('complete onboarding flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="start-onboarding"]');
  // ... complete flow
});
```

---

*Last updated: November 2025*
