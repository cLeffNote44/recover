# Recovery Journey - API Documentation

## Table of Contents

1. [Context APIs](#context-apis)
2. [Utility Functions](#utility-functions)
3. [Analytics Engine](#analytics-engine)
4. [Storage Management](#storage-management)
5. [Animation Utilities](#animation-utilities)

---

## Context APIs

### AppContext

The main application state context.

#### Hook: `useAppContext()`

Returns all application state and methods.

```typescript
const {
  // Sobriety Data
  sobrietyDate,
  setSobrietyDate,

  // Check-ins
  checkIns,
  setCheckIns,
  addCheckIn,

  // Cravings
  cravings,
  setCravings,
  addCraving,

  // Goals
  goals,
  addGoal,
  updateGoal,
  deleteGoal,

  // Badges
  unlockedBadges,
  setUnlockedBadges,

  // Settings
  costPerDay,
  setCostPerDay,
  celebrationsEnabled,
  toggleCelebrations,

  // Utility methods
  refreshData,
  exportData,
  importData
} = useAppContext();
```

#### Methods

**`addCheckIn(checkIn: Omit<CheckIn, 'id'>): void`**
- Adds a new check-in entry
- Auto-generates ID
- Persists to localStorage
- Triggers celebration if milestone

**`addCraving(craving: Omit<Craving, 'id'>): void`**
- Adds a new craving entry
- Auto-generates ID
- Persists to localStorage

**`addGoal(goal: Omit<Goal, 'id'>): void`**
- Creates a new goal
- Auto-generates ID
- Persists to localStorage

**`updateGoal(id: number, updates: Partial<Goal>): void`**
- Updates an existing goal
- Persists changes
- Triggers celebration if completed

**`exportData(): Blob`**
- Exports all app data as JSON
- Includes metadata (version, date)
- Returns downloadable Blob

**`importData(file: File): Promise<ImportResult>`**
- Imports data from backup file
- Validates structure
- Merges or replaces data

---

### ThemeContext

Theme and appearance management.

#### Hook: `useTheme()`

```typescript
const {
  theme,           // 'light' | 'dark' | 'system'
  setTheme,        // (theme: Theme) => void
  colorScheme,     // Current color scheme name
  setColorScheme,  // (scheme: string) => void
  resolvedTheme    // Computed theme based on system
} = useTheme();
```

---

## Utility Functions

### utils-app.ts

#### `calculateDaysSober(sobrietyDate: string): number`

Calculates days sober from sobriety date.

```typescript
const days = calculateDaysSober('2024-01-01');
// Returns: number of days since date
```

#### `calculateStreak(checkIns: CheckIn[]): number`

Calculates current consecutive check-in streak.

```typescript
const streak = calculateStreak(checkIns);
// Returns: number of consecutive days
```

#### `getMilestone(days: number): Milestone`

Returns milestone information for given days.

```typescript
const milestone = getMilestone(30);
// Returns: { text: '30 Days!', color: 'purple' }
```

#### `calculateTotalSavings(days: number, costPerDay: number): number`

Calculates total money saved.

```typescript
const savings = calculateTotalSavings(30, 10);
// Returns: 300
```

#### `getMoodTrend(checkIns: CheckIn[]): 'improving' | 'stable' | 'declining'`

Analyzes recent mood trend.

```typescript
const trend = getMoodTrend(recentCheckIns);
// Returns: 'improving' | 'stable' | 'declining'
```

---

## Analytics Engine

### analytics-engine.ts

#### `analyzeCravingPatterns(cravings: Craving[]): CravingPattern`

Analyzes craving patterns and returns insights.

```typescript
const patterns = analyzeCravingPatterns(cravings);
// Returns: {
//   timeOfDay: Array<{hour, count, avgIntensity}>,
//   dayOfWeek: Array<{day, count, avgIntensity}>,
//   topTriggers: Array<{trigger, count, successRate}>,
//   peakTimes: string[],
//   riskFactors: string[]
// }
```

#### `analyzeMoodTrend(checkIns: CheckIn[]): MoodTrend`

Analyzes mood trends with predictions.

```typescript
const moodAnalysis = analyzeMoodTrend(checkIns);
// Returns: {
//   trend: 'improving' | 'stable' | 'declining',
//   avgMood: number,
//   recentAvg: number,
//   prediction: 'positive' | 'neutral' | 'concerning',
//   recommendations: string[]
// }
```

#### `calculateSuccessMetrics(cravings: Craving[]): SuccessMetrics`

Calculates craving success metrics.

```typescript
const metrics = calculateSuccessMetrics(cravings);
// Returns: {
//   successRate: number,
//   totalCravings: number,
//   overcame: number,
//   avgIntensity: number,
//   strongestStrategies: string[]
// }
```

#### `generateInsights(data: AnalyticsData): Insight[]`

Generates personalized insights from all data.

```typescript
const insights = generateInsights({
  checkIns,
  cravings,
  meetings,
  sobrietyDate
});
// Returns: Array of Insight objects
```

**Insight Types:**
- `success` - Positive achievements
- `warning` - Risk factors detected
- `tip` - Helpful suggestions
- `achievement` - Milestones reached

---

## Storage Management

### data-backup.ts

#### `exportAppData(data: AppData): Blob`

Exports all app data to downloadable JSON file.

```typescript
const blob = exportAppData(appData);
const url = URL.createObjectURL(blob);
// Download blob as file
```

**Export Format:**
```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-01T00:00:00.000Z",
  "appName": "Recovery Journey",
  "data": { /* AppData */ }
}
```

#### `importAppData(file: File): Promise<ImportResult>`

Imports data from backup file.

```typescript
const result = await importAppData(file);
if (result.success) {
  // Apply result.data
} else {
  // Handle result.errors
}
```

**Validation:**
- File format validation
- Version compatibility check
- Data structure validation
- Required fields verification

---

## Animation Utilities

### animations.ts

#### Animation Variants

Pre-defined Framer Motion variants for consistent animations.

**`fadeIn`**
```typescript
const variants = fadeIn;
// Usage: <motion.div variants={fadeIn} initial="hidden" animate="visible" />
```

**`fadeSlideUp`**
- Fades in while sliding up from below

**`scaleIn`**
- Scales up from 80% to 100% with fade

**`staggerContainer` & `staggerItem`**
- For staggered list animations

#### Easing Curves

```typescript
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};
```

#### Spring Configurations

```typescript
export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  slow: { type: 'spring', stiffness: 80, damping: 15 }
};
```

---

## Chart Utilities

### chart-utils.ts

#### `generateCravingTimeline(cravings: Craving[]): CravingTimelineData[]`

Generates daily craving intensity data for charts.

```typescript
const data = generateCravingTimeline(cravings);
// Returns: [{ date, intensity, count }, ...]
```

#### `generateMoodDistribution(checkIns: CheckIn[]): MoodDistributionData[]`

Generates mood distribution percentages.

```typescript
const data = generateMoodDistribution(checkIns);
// Returns: [{ mood, count, percentage }, ...]
```

#### `filterByDateRange(data: any[], range: DateRange): any[]`

Filters data by date range.

```typescript
const filtered = filterByDateRange(checkIns, 'week');
// Ranges: 'week' | 'month' | 'quarter' | 'year' | 'all'
```

---

## Celebration System

### celebrations.ts

#### `celebrate(type: CelebrationType, options?: CelebrationOptions): void`

Triggers celebration animations, sounds, and haptics.

```typescript
celebrate('milestone', {
  confettiCount: 200,
  sound: true,
  haptic: true
});
```

**Types:**
- `milestone` - Major achievement
- `badge` - Badge unlocked
- `checkIn` - Daily check-in completed
- `goalComplete` - Goal completed
- `streakMilestone` - Streak milestone

---

## Audio & Haptics

### audio-manager.ts

#### `audioManager.play(type: SoundType): void`

Plays a sound effect.

```typescript
audioManager.play('success');
```

**Sound Types:**
- `success` - C-E-G major chord
- `achievement` - Triumphant fanfare
- `celebration` - Energetic sequence
- `tap` - Subtle click
- `notification` - Attention sound
- `warning` - Alert tone
- `complete` - Task completion

#### `audioManager.setVolume(volume: number): void`

Sets volume (0-100).

```typescript
audioManager.setVolume(75);
```

### haptics.ts

#### `hapticsManager.impact(type: HapticType): void`

Triggers haptic feedback.

```typescript
hapticsManager.impact('success');
```

**Haptic Types:**
- `light` - 10ms vibration
- `medium` - 20ms vibration
- `heavy` - 40ms vibration
- `success` - Double pulse pattern
- `warning` - Three short pulses
- `error` - Long-short pattern
- `selection` - Subtle tap

---

## Share System

### share-manager.ts

#### `generateCardImage(element: HTMLElement): Promise<Blob | null>`

Converts DOM element to image blob.

```typescript
const blob = await generateCardImage(cardRef.current);
```

#### `shareCard(blob: Blob, title: string, text?: string): Promise<boolean>`

Shares image using native share sheet.

```typescript
const success = await shareCard(blob, 'My Progress', 'Check out my journey!');
```

**Fallback Chain:**
1. Capacitor Share API (mobile)
2. Web Share API (modern browsers)
3. Download file (fallback)

---

## Type Definitions

See `src/types/app.ts` for complete type definitions of all interfaces and types used throughout the application.

### Key Types

```typescript
type Mood = 1 | 2 | 3 | 4 | 5;
type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
type GoalCategory = 'recovery' | 'wellness' | 'personal' | 'social';
type Theme = 'light' | 'dark' | 'system';
type CelebrationType = 'milestone' | 'badge' | 'checkIn' | 'goalComplete' | 'streakMilestone';
```

---

## Error Handling

All async functions return promises that should be handled with try-catch:

```typescript
try {
  const result = await importAppData(file);
  if (result.success) {
    // Success
  } else {
    // Handle validation errors
    console.error(result.errors);
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Import failed:', error);
}
```

---

## Best Practices

1. **Always validate user input** before passing to functions
2. **Use TypeScript types** for compile-time safety
3. **Handle errors gracefully** with user-friendly messages
4. **Persist data immediately** after state changes
5. **Debounce rapid updates** to localStorage
6. **Test edge cases** (empty arrays, null values, etc.)
7. **Use hooks at component top level** (React rules)
8. **Memoize expensive calculations** with useMemo
9. **Clean up effects** (remove listeners, cancel timers)
10. **Follow accessibility guidelines** (ARIA labels, keyboard nav)
