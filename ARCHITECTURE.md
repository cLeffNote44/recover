# Recovery Journey - Architecture Documentation

## Overview

Recovery Journey is a React-based Progressive Web App (PWA) built with TypeScript, Vite, and Capacitor for cross-platform deployment (Web, iOS, Android).

## Technology Stack

### Core
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety and better DX
- **Vite 5.x** - Build tool and dev server
- **Capacitor 7.x** - Native mobile wrapper

### UI & Styling
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion 12.x** - Animation library
- **Lucide React** - Icon library

### State Management
- **React Context API** - Global state management
  - `AppContext` - Application data
  - `ThemeContext` - Theme and dark mode

### Data Persistence
- **localStorage** - Primary data storage
- **Capacitor Preferences** - Mobile preferences storage

### Testing
- **Vitest 4.x** - Unit testing framework
- **React Testing Library** - Component testing
- **jsdom** - DOM implementation for testing

## Project Structure

```
source/
├── src/
│   ├── components/          # React components
│   │   ├── animated/       # Animation components
│   │   ├── app/            # App-specific components
│   │   │   └── screens/    # Screen components
│   │   ├── charts/         # Chart components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── test/               # Test setup and utilities
│   └── App.tsx             # Root application component
├── public/                 # Static assets
├── ios/                    # iOS native project (Capacitor)
├── android/                # Android native project (Capacitor)
└── dist/                   # Build output
```

## Architecture Patterns

### Component Architecture

The app uses a **component-based architecture** with the following layers:

1. **Pages** (`src/pages/`) - Top-level route components
2. **Screens** (`src/components/app/screens/`) - Feature-specific views
3. **Components** (`src/components/`) - Reusable UI elements
4. **UI Primitives** (`src/components/ui/`) - Base components from Radix UI

### State Management

**Context-based state management** with two main contexts:

1. **AppContext** - Manages all application data
   - Sobriety tracking data
   - Check-ins, cravings, meetings
   - Badges, goals, settings
   - Provides CRUD operations for all entities

2. **ThemeContext** - Manages UI theme
   - Dark/light mode
   - Color scheme selection
   - Theme persistence

### Data Flow

```
User Action → Screen Component → Context Hook → Context Provider → localStorage
                                       ↓
                            Updates State (React)
                                       ↓
                            Re-renders Components
```

### Routing

Uses **Wouter** for client-side routing:
- Hash-based routing for better mobile compatibility
- Programmatic navigation via `useLocation` hook
- Bottom navigation for primary navigation

### Animation Strategy

**Framer Motion** for declarative animations:
- Page transitions
- List animations with stagger
- Number count-up animations
- Micro-interactions (hover, tap)
- Celebration animations with canvas-confetti

### Performance Optimizations

1. **Code Splitting** - Lazy-loaded screens
2. **Memoization** - `useMemo` and `useCallback` for expensive operations
3. **Animation Optimization** - `will-change` CSS, reduced motion support
4. **Storage Optimization** - Debounced saves to localStorage

## Key Features Architecture

### 1. Sobriety Tracking
- **Storage**: localStorage key `sobrietyDate`
- **Calculation**: Real-time day calculation in components
- **Display**: AnimatedNumber component for smooth updates

### 2. Check-in System
- **Model**: `CheckIn` interface with mood, notes, HALT assessment
- **Storage**: Array in AppContext, persisted to localStorage
- **Streak Calculation**: Daily consecutive check-ins

### 3. Craving Management
- **Model**: `Craving` interface with intensity, triggers, coping strategies
- **Analytics**: Real-time pattern detection and insights
- **Success Tracking**: Overcame boolean for success rate

### 4. Badge System
- **Model**: 56 badges across 6 categories with 5 tier levels
- **Calculation**: Utility functions check criteria against user data
- **Unlocking**: Automatic with celebration animations

### 5. Goals & Habits
- **Types**: Numerical, Yes-No, Streak-based
- **Frequencies**: Daily, Weekly, Monthly, One-time
- **Progress**: Real-time tracking with visual progress bars

### 6. Analytics & Insights
- **Engine**: `analytics-engine.ts` with pattern detection
- **Visualizations**: Recharts library for interactive charts
- **AI Insights**: Predictive trend analysis and recommendations

### 7. Sharing System
- **Generation**: html2canvas for image creation
- **Sharing**: Capacitor Share API with Web Share fallback
- **Templates**: ShareCard component with customizable designs

## Data Models

### Core Entities

```typescript
interface CheckIn {
  id: number;
  date: string;
  mood: number;      // 1-5
  notes?: string;
  halt?: HALTCheck; // Hungry/Angry/Lonely/Tired
}

interface Craving {
  id: number;
  date: string;
  intensity: number;     // 1-10
  trigger: string;
  copingStrategy?: string;
  overcame: boolean;
}

interface Goal {
  id: number;
  title: string;
  category: GoalCategory;
  targetType: 'numerical' | 'yes-no' | 'streak';
  targetValue: number;
  currentValue: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: BadgeCategory;
}
```

## Security & Privacy

### Data Storage
- **Local-first**: All data stored locally on device
- **No backend**: No server-side data storage
- **No tracking**: No analytics or tracking

### Privacy Features
- **Offline-first**: Works completely offline
- **Encrypted backups**: Optional encrypted data exports
- **No account required**: No email, password, or personal info

## Mobile Integration (Capacitor)

### Native Features Used
1. **Local Notifications** - Reminder system
2. **Haptics** - Tactile feedback
3. **Share API** - Native sharing dialogs
4. **Splash Screen** - Native splash screens
5. **App** - Lifecycle and state management

### Platform-Specific Considerations
- **iOS**: Uses UIKit navigation patterns
- **Android**: Material Design patterns
- **Web**: Responsive design with PWA features

## Build & Deployment

### Development
```bash
npm run dev              # Start dev server
npm run check            # TypeScript type checking
npm run test             # Run tests
npm run test:coverage    # Coverage report
```

### Production Build
```bash
npm run build           # Web build
npm run build:mobile    # Mobile build + sync
```

### Mobile Deployment
```bash
npm run cap:sync        # Sync web assets to native
npm run cap:open:ios    # Open Xcode
npm run cap:open:android # Open Android Studio
```

## Testing Strategy

### Unit Tests
- **Location**: `*.test.ts` files
- **Framework**: Vitest
- **Coverage**: Utility functions, business logic

### Component Tests
- **Location**: `*.test.tsx` files
- **Framework**: React Testing Library
- **Coverage**: UI components, user interactions

### E2E Tests (Planned)
- **Framework**: Playwright
- **Coverage**: Critical user flows

## Performance Metrics

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500KB gzipped

### Optimization Techniques
1. Tree shaking with Vite
2. Code splitting by route
3. Image optimization
4. CSS purging with Tailwind
5. Minification and compression

## Scalability Considerations

### Current Limitations
- localStorage has 5-10MB limit
- No data synchronization across devices
- Limited to single user per device

### Future Enhancements
- Cloud backup with E2E encryption
- Multi-device sync
- Relational database for large datasets
- Backend API for community features

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - See [LICENSE](./LICENSE) for details.
