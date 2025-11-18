/**
 * Recovery Store
 *
 * Manages sobriety tracking, setbacks, and recovery milestones
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Setback, ReasonForSobriety } from '@/types/app';

interface RecoveryState {
  // State
  recoveryStartDate: string;
  sobrietyDate: string;
  setbacks: Setback[];
  reasonsForSobriety: ReasonForSobriety[];
  unlockedBadges: string[];
  costPerDay: number;
  savingsGoal: string;
  savingsGoalAmount: number;
  celebrationsEnabled: boolean;

  // Actions
  setRecoveryStartDate: (date: string) => void;
  setSobrietyDate: (date: string) => void;
  setSetbacks: (setbacks: Setback[]) => void;
  setReasonsForSobriety: (reasons: ReasonForSobriety[]) => void;
  setUnlockedBadges: (badges: string[]) => void;
  setCostPerDay: (cost: number) => void;
  setSavingsGoal: (goal: string) => void;
  setSavingsGoalAmount: (amount: number) => void;
  setCelebrationsEnabled: (enabled: boolean) => void;

  // Helpers
  addSetback: (setback: Setback) => void;
  addReasonForSobriety: (reason: ReasonForSobriety) => void;
  unlockBadge: (badge: string) => void;
}

export const useRecoveryStore = create<RecoveryState>()(
  persist(
    (set) => ({
      // Initial state
      recoveryStartDate: new Date().toISOString().split('T')[0],
      sobrietyDate: new Date().toISOString().split('T')[0],
      setbacks: [],
      reasonsForSobriety: [],
      unlockedBadges: [],
      costPerDay: 0,
      savingsGoal: '',
      savingsGoalAmount: 0,
      celebrationsEnabled: true,

      // Actions
      setRecoveryStartDate: (date) => set({ recoveryStartDate: date }),
      setSobrietyDate: (date) => set({ sobrietyDate: date }),
      setSetbacks: (setbacks) => set({ setbacks }),
      setReasonsForSobriety: (reasons) => set({ reasonsForSobriety: reasons }),
      setUnlockedBadges: (badges) => set({ unlockedBadges: badges }),
      setCostPerDay: (cost) => set({ costPerDay: cost }),
      setSavingsGoal: (goal) => set({ savingsGoal: goal }),
      setSavingsGoalAmount: (amount) => set({ savingsGoalAmount: amount }),
      setCelebrationsEnabled: (enabled) => set({ celebrationsEnabled: enabled }),

      // Helper methods
      addSetback: (setback) =>
        set((state) => ({
          setbacks: [...state.setbacks, setback],
        })),
      addReasonForSobriety: (reason) =>
        set((state) => ({
          reasonsForSobriety: [...state.reasonsForSobriety, reason],
        })),
      unlockBadge: (badge) =>
        set((state) => ({
          unlockedBadges: state.unlockedBadges.includes(badge)
            ? state.unlockedBadges
            : [...state.unlockedBadges, badge],
        })),
    }),
    {
      name: 'recovery-store',
    }
  )
);
