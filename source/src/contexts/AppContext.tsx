import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AppData, CheckIn, Meeting, GrowthLog, Challenge, Gratitude, Contact, CalendarEvent, Craving, Meditation, RelapsePlan, ReasonForSobriety, NotificationSettings, Goal, GoalProgress, Quote, QuoteSettings, SkillBuilding, UserProfile, SleepEntry, Medication, MedicationLog, ExerciseEntry, NutritionEntry, Relapse, CleanPeriod, StepWorkProgress, StepWorkEntry, TWELVE_STEPS } from '@/types/app';
import { MOTIVATIONAL_QUOTES } from '@/lib/constants';
import { initializeNotifications } from '@/lib/notifications';
import { getQuoteOfTheDay, getRandomQuote, QUOTES } from '@/lib/quotes';

interface AppContextType extends AppData {
  // Setters
  setUserProfile: (profile: UserProfile | null) => void;
  setSobrietyDate: (date: string) => void;
  setCheckIns: (checkIns: CheckIn[]) => void;
  setMeetings: (meetings: Meeting[]) => void;
  setGrowthLogs: (logs: GrowthLog[]) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setGratitude: (gratitude: Gratitude[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setCravings: (cravings: Craving[]) => void;
  setMeditations: (meditations: Meditation[]) => void;
  setRelapsePlan: (plan: RelapsePlan) => void;
  setDarkMode: (mode: boolean) => void;
  setCostPerDay: (cost: number) => void;
  setSavingsGoal: (goal: string) => void;
  setSavingsGoalAmount: (amount: number) => void;
  setReasonsForSobriety: (reasons: ReasonForSobriety[]) => void;
  setUnlockedBadges: (badges: string[]) => void;
  setNotificationSettings: (settings: NotificationSettings) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setCelebrationsEnabled: (enabled: boolean) => void;
  setGoals: (goals: Goal[]) => void;
  setGoalProgress: (progress: GoalProgress[]) => void;
  setCustomQuotes: (quotes: Quote[]) => void;
  setFavoriteQuoteIds: (ids: string[]) => void;
  setQuoteSettings: (settings: QuoteSettings) => void;
  setSkillBuilding: (skillBuilding: SkillBuilding) => void;
  setSleepEntries: (sleepEntries: SleepEntry[]) => void;
  setMedications: (medications: Medication[]) => void;
  setMedicationLogs: (medicationLogs: MedicationLog[]) => void;
  setExerciseEntries: (exerciseEntries: ExerciseEntry[]) => void;
  setNutritionEntries: (nutritionEntries: NutritionEntry[]) => void;
  setRelapses: (relapses: Relapse[]) => void;
  setCleanPeriods: (cleanPeriods: CleanPeriod[]) => void;
  setStepWork: (stepWork: StepWorkProgress) => void;

  // Helpers
  currentQuote: Quote;
  loading: boolean;
  refreshData: () => Promise<void>;
  refreshQuote: () => void;
  addCustomQuote: (text: string, author?: string) => void;
  removeQuote: (quoteId: string) => void;
  toggleFavoriteQuote: (quoteId: string) => void;
  getAvailableQuotes: () => Quote[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

const STORAGE_KEY = 'recovery_journey_data';

const defaultRelapsePlan: RelapsePlan = {
  warningSigns: [],
  highRiskSituations: [],
  greenActions: [],
  yellowActions: [],
  redActions: []
};

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dailyReminderTime: '09:00',
  streakReminders: true,
  meetingReminders: true,
  milestoneNotifications: true,
};

const defaultQuoteSettings: QuoteSettings = {
  refreshFrequency: 'daily',
  lastRefresh: new Date().toISOString(),
  disabledQuoteIds: []
};

const defaultSkillBuilding: SkillBuilding = {
  mindfulnessChallenge: {
    currentDay: 0,
    completedDays: [],
    notes: {}
  },
  copingSkillUsage: [],
  triggerExercises: [],
  connectionPrompts: [],
  valuesClarification: [],
  selfCompassion: []
};

const defaultStepWork: StepWorkProgress = {
  currentStep: 1,
  steps: TWELVE_STEPS.map((step) => ({
    stepNumber: step.number,
    status: 'not-started' as const,
    notes: '',
    reflections: [],
    exercises: []
  })),
  sponsorNotes: '',
  lastReviewDate: undefined
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sobrietyDate, setSobrietyDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [gratitude, setGratitude] = useState<Gratitude[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [relapsePlan, setRelapsePlan] = useState<RelapsePlan>(defaultRelapsePlan);
  const [darkMode, setDarkMode] = useState(false);
  const [costPerDay, setCostPerDay] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(0);
  const [reasonsForSobriety, setReasonsForSobriety] = useState<ReasonForSobriety[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [celebrationsEnabled, setCelebrationsEnabled] = useState(true); // Default to enabled
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);
  const [customQuotes, setCustomQuotes] = useState<Quote[]>([]);
  const [favoriteQuoteIds, setFavoriteQuoteIds] = useState<string[]>([]);
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings>(defaultQuoteSettings);
  const [skillBuilding, setSkillBuilding] = useState<SkillBuilding>(defaultSkillBuilding);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [relapses, setRelapses] = useState<Relapse[]>([]);
  const [cleanPeriods, setCleanPeriods] = useState<CleanPeriod[]>([]);
  const [stepWork, setStepWork] = useState<StepWorkProgress>(defaultStepWork);
  const [currentQuote, setCurrentQuote] = useState<Quote>(getQuoteOfTheDay());

  // Memoize loadData function to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const data: AppData = JSON.parse(stored);
          setUserProfile(data.userProfile || null);

          // Use sobriety date from profile if it exists, otherwise use standalone sobrietyDate
          const dateToUse = data.userProfile?.sobrietyDate || data.sobrietyDate || new Date().toISOString().split('T')[0];
          setSobrietyDate(dateToUse);
          setCheckIns(data.checkIns || []);
          setMeetings(data.meetings || []);
          setGrowthLogs(data.growthLogs || []);
          setChallenges(data.challenges || []);
          setGratitude(data.gratitude || []);
          setContacts(data.contacts || []);
          setEvents(data.events || []);
          setCravings(data.cravings || []);
          setMeditations(data.meditations || []);
          setRelapsePlan(data.relapsePlan || defaultRelapsePlan);
          setDarkMode(data.darkMode || false);
          setCostPerDay(data.costPerDay || 0);
          setSavingsGoal(data.savingsGoal || '');
          setSavingsGoalAmount(data.savingsGoalAmount || 0);
          setReasonsForSobriety(data.reasonsForSobriety || []);
          setUnlockedBadges(data.unlockedBadges || []);
          setNotificationSettings(data.notificationSettings || defaultNotificationSettings);
          setOnboardingCompleted(data.onboardingCompleted || false);
          setCelebrationsEnabled(data.celebrationsEnabled !== undefined ? data.celebrationsEnabled : true);
          setGoals(data.goals || []);
          setGoalProgress(data.goalProgress || []);
          setCustomQuotes(data.customQuotes || []);
          setFavoriteQuoteIds(data.favoriteQuoteIds || []);
          setQuoteSettings(data.quoteSettings || defaultQuoteSettings);
          setSkillBuilding(data.skillBuilding || defaultSkillBuilding);
          setSleepEntries(data.sleepEntries || []);
          setMedications(data.medications || []);
          setMedicationLogs(data.medicationLogs || []);
          setExerciseEntries(data.exerciseEntries || []);
          setNutritionEntries(data.nutritionEntries || []);
          setRelapses(data.relapses || []);
          setCleanPeriods(data.cleanPeriods || []);
          setStepWork(data.stepWork || defaultStepWork);
        } catch (parseError) {
          console.error('Error parsing stored data. Data may be corrupted:', parseError);
          // Show error toast if toast is available
          if (typeof window !== 'undefined' && (window as any).toast) {
            (window as any).toast.error('Could not load saved data. Starting fresh.');
          }
          // Clear corrupted data
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Set quote based on refresh frequency
      setCurrentQuote(getQuoteOfTheDay());
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't crash the app, just log the error
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error('Failed to load data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since setters are stable

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        const dataToSave: AppData = {
          userProfile,
          sobrietyDate,
          checkIns,
          meetings,
          growthLogs,
          challenges,
          gratitude,
          contacts,
          events,
          cravings,
          meditations,
          relapsePlan,
          darkMode,
          costPerDay,
          savingsGoal,
          savingsGoalAmount,
          reasonsForSobriety,
          unlockedBadges,
          notificationSettings,
          onboardingCompleted,
          celebrationsEnabled,
          goals,
          goalProgress,
          customQuotes,
          favoriteQuoteIds,
          quoteSettings,
          skillBuilding,
          sleepEntries,
          medications,
          medicationLogs,
          exerciseEntries,
          nutritionEntries,
          relapses,
          cleanPeriods,
          stepWork
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (saveError) {
        console.error('Error saving data to localStorage:', saveError);
        // Show error toast if storage is full or other error
        if (typeof window !== 'undefined' && (window as any).toast) {
          (window as any).toast.error('Could not save your data. Storage may be full.');
        }
      }
    }
  }, [
    loading, userProfile, sobrietyDate, checkIns, meetings, growthLogs, challenges,
    gratitude, contacts, events, cravings, meditations, relapsePlan,
    darkMode, costPerDay, savingsGoal, savingsGoalAmount, reasonsForSobriety,
    unlockedBadges, notificationSettings, onboardingCompleted, celebrationsEnabled,
    goals, goalProgress, customQuotes, favoriteQuoteIds, quoteSettings, skillBuilding,
    sleepEntries, medications, medicationLogs, exerciseEntries, nutritionEntries,
    relapses, cleanPeriods, stepWork
  ]);

  // Sync sobrietyDate changes to userProfile (but avoid infinite loops)
  useEffect(() => {
    if (!loading && userProfile && userProfile.sobrietyDate !== sobrietyDate) {
      // Only update if the difference is significant (not just loading)
      const profileDate = new Date(userProfile.sobrietyDate).getTime();
      const currentDate = new Date(sobrietyDate).getTime();

      if (profileDate !== currentDate) {
        setUserProfile({
          ...userProfile,
          sobrietyDate: sobrietyDate
        });
      }
    }
  }, [sobrietyDate]);

  // Initialize notifications when settings change
  useEffect(() => {
    if (!loading && onboardingCompleted) {
      initializeNotifications(notificationSettings);
    }
  }, [notificationSettings, loading, onboardingCompleted]);

  // Quote management functions
  const getAvailableQuotes = useCallback((): Quote[] => {
    // Combine preloaded quotes (not disabled) with custom quotes
    const enabledPreloadedQuotes = QUOTES.filter(q => !quoteSettings.disabledQuoteIds.includes(q.id));
    return [...enabledPreloadedQuotes, ...customQuotes];
  }, [customQuotes, quoteSettings.disabledQuoteIds]);

  const refreshQuote = useCallback(() => {
    const availableQuotes = getAvailableQuotes();
    if (availableQuotes.length === 0) {
      // If no quotes available, use default
      setCurrentQuote(QUOTES[0]!);
      return;
    }

    // Get a random quote that's different from current
    const otherQuotes = availableQuotes.filter(q => q.id !== currentQuote.id);
    const randomQuote = otherQuotes.length > 0
      ? otherQuotes[Math.floor(Math.random() * otherQuotes.length)]!
      : availableQuotes[0]!;

    setCurrentQuote(randomQuote);
    setQuoteSettings(prev => ({ ...prev, lastRefresh: new Date().toISOString() }));
  }, [currentQuote.id, getAvailableQuotes]);

  const addCustomQuote = useCallback((text: string, author?: string) => {
    const newQuote: Quote = {
      id: `custom-${Date.now()}`,
      text,
      author,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    setCustomQuotes(prev => [...prev, newQuote]);
  }, []);

  const removeQuote = useCallback((quoteId: string) => {
    // If it's a custom quote, remove it from customQuotes
    if (quoteId.startsWith('custom-')) {
      setCustomQuotes(prev => prev.filter(q => q.id !== quoteId));
    } else {
      // If it's a preloaded quote, add to disabled list
      setQuoteSettings(prev => ({
        ...prev,
        disabledQuoteIds: [...prev.disabledQuoteIds, quoteId]
      }));
    }

    // If we removed the current quote, refresh to a new one
    if (currentQuote.id === quoteId) {
      refreshQuote();
    }
  }, [currentQuote.id, refreshQuote]);

  const toggleFavoriteQuote = useCallback((quoteId: string) => {
    setFavoriteQuoteIds(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      } else {
        return [...prev, quoteId];
      }
    });
  }, []);

  // Auto-refresh quote based on frequency setting
  useEffect(() => {
    if (loading) return;

    const checkQuoteRefresh = () => {
      const { refreshFrequency, lastRefresh } = quoteSettings;
      const now = new Date();
      const lastRefreshDate = new Date(lastRefresh);

      let shouldRefresh = false;

      switch (refreshFrequency) {
        case 'hourly':
          const hoursSinceRefresh = (now.getTime() - lastRefreshDate.getTime()) / (1000 * 60 * 60);
          shouldRefresh = hoursSinceRefresh >= 1;
          break;
        case 'daily':
          const daysSinceRefresh = Math.floor((now.getTime() - lastRefreshDate.getTime()) / (1000 * 60 * 60 * 24));
          shouldRefresh = daysSinceRefresh >= 1;
          break;
        case 'on-open':
          // Always refresh on app open (already handled in loadData)
          break;
      }

      if (shouldRefresh) {
        refreshQuote();
      }
    };

    checkQuoteRefresh();
  }, [loading, quoteSettings, refreshQuote]);

  // Memoize context value to prevent unnecessary re-renders
  const value: AppContextType = useMemo(() => ({
    userProfile,
    sobrietyDate,
    checkIns,
    meetings,
    growthLogs,
    challenges,
    gratitude,
    contacts,
    events,
    cravings,
    meditations,
    relapsePlan,
    darkMode,
    costPerDay,
    savingsGoal,
    savingsGoalAmount,
    reasonsForSobriety,
    unlockedBadges,
    notificationSettings,
    onboardingCompleted,
    celebrationsEnabled,
    goals,
    goalProgress,
    customQuotes,
    favoriteQuoteIds,
    quoteSettings,
    skillBuilding,
    sleepEntries,
    medications,
    medicationLogs,
    exerciseEntries,
    nutritionEntries,
    relapses,
    cleanPeriods,
    stepWork,
    setUserProfile,
    setSobrietyDate,
    setCheckIns,
    setMeetings,
    setGrowthLogs,
    setChallenges,
    setGratitude,
    setContacts,
    setEvents,
    setCravings,
    setMeditations,
    setRelapsePlan,
    setDarkMode,
    setCostPerDay,
    setSavingsGoal,
    setSavingsGoalAmount,
    setReasonsForSobriety,
    setUnlockedBadges,
    setNotificationSettings,
    setOnboardingCompleted,
    setCelebrationsEnabled,
    setGoals,
    setGoalProgress,
    setCustomQuotes,
    setFavoriteQuoteIds,
    setQuoteSettings,
    setSkillBuilding,
    setSleepEntries,
    setMedications,
    setMedicationLogs,
    setExerciseEntries,
    setNutritionEntries,
    setRelapses,
    setCleanPeriods,
    setStepWork,
    currentQuote,
    loading,
    refreshData: loadData,
    refreshQuote,
    addCustomQuote,
    removeQuote,
    toggleFavoriteQuote,
    getAvailableQuotes
  }), [
    userProfile, sobrietyDate, checkIns, meetings, growthLogs, challenges,
    gratitude, contacts, events, cravings, meditations, relapsePlan,
    darkMode, costPerDay, savingsGoal, savingsGoalAmount, reasonsForSobriety,
    unlockedBadges, notificationSettings, onboardingCompleted, celebrationsEnabled,
    goals, goalProgress, customQuotes, favoriteQuoteIds, quoteSettings, skillBuilding,
    sleepEntries, medications, medicationLogs, exerciseEntries, nutritionEntries,
    relapses, cleanPeriods, stepWork,
    currentQuote, loading, loadData, refreshQuote, addCustomQuote, removeQuote,
    toggleFavoriteQuote, getAvailableQuotes
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

