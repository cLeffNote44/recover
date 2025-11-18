/**
 * Settings Store
 *
 * Manages app settings, notifications, goals, contacts, and relapse plan
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationSettings, Goal, GoalProgress, Contact, RelapsePlan, SkillBuildingData } from '@/types/app';

const defaultRelapsePlan: RelapsePlan = {
  warningSigns: [],
  highRiskSituations: [],
  greenActions: [],
  yellowActions: [],
  redActions: [],
};

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dailyReminderTime: '09:00',
  streakReminders: true,
  meetingReminders: true,
  milestoneNotifications: true,
};

const defaultSkillBuilding: SkillBuildingData = {
  mindfulnessChallenge: {
    currentDay: 0,
    startDate: new Date().toISOString().split('T')[0],
    completedDays: [],
    notes: {},
  },
  triggerExercises: [],
  connectionPrompts: [],
  copingSkillUsage: [],
  breathingExercises: [],
  values: [],
  valuesReflections: [],
  selfCompassionEntries: [],
};

interface SettingsState {
  // State
  darkMode: boolean;
  notificationSettings: NotificationSettings;
  onboardingCompleted: boolean;
  goals: Goal[];
  goalProgress: GoalProgress[];
  contacts: Contact[];
  relapsePlan: RelapsePlan;
  skillBuilding: SkillBuildingData;

  // Actions
  setDarkMode: (mode: boolean) => void;
  setNotificationSettings: (settings: NotificationSettings) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setGoals: (goals: Goal[]) => void;
  setGoalProgress: (progress: GoalProgress[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setRelapsePlan: (plan: RelapsePlan) => void;
  setSkillBuilding: (skillBuilding: SkillBuildingData) => void;

  // Helpers
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addContact: (contact: Contact) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      darkMode: false,
      notificationSettings: defaultNotificationSettings,
      onboardingCompleted: false,
      goals: [],
      goalProgress: [],
      contacts: [],
      relapsePlan: defaultRelapsePlan,
      skillBuilding: defaultSkillBuilding,

      // Actions
      setDarkMode: (mode) => set({ darkMode: mode }),
      setNotificationSettings: (settings) => set({ notificationSettings: settings }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setGoals: (goals) => set({ goals }),
      setGoalProgress: (progress) => set({ goalProgress: progress }),
      setContacts: (contacts) => set({ contacts }),
      setRelapsePlan: (plan) => set({ relapsePlan: plan }),
      setSkillBuilding: (skillBuilding) => set({ skillBuilding }),

      // Helper methods
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
        })),
      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, contact],
        })),
    }),
    {
      name: 'settings-store',
    }
  )
);
