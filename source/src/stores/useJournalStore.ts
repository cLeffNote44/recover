/**
 * Journal Store
 *
 * Manages check-ins, gratitude entries, and growth logs
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CheckIn, Gratitude, GrowthLog } from '@/types/app';

interface JournalState {
  // State
  checkIns: CheckIn[];
  gratitude: Gratitude[];
  growthLogs: GrowthLog[];

  // Actions
  setCheckIns: (checkIns: CheckIn[]) => void;
  setGratitude: (gratitude: Gratitude[]) => void;
  setGrowthLogs: (logs: GrowthLog[]) => void;

  // Helpers
  addCheckIn: (checkIn: CheckIn) => void;
  addGratitude: (item: Gratitude) => void;
  addGrowthLog: (log: GrowthLog) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      // Initial state
      checkIns: [],
      gratitude: [],
      growthLogs: [],

      // Actions
      setCheckIns: (checkIns) => set({ checkIns }),
      setGratitude: (gratitude) => set({ gratitude }),
      setGrowthLogs: (logs) => set({ growthLogs: logs }),

      // Helper methods
      addCheckIn: (checkIn) =>
        set((state) => ({
          checkIns: [...state.checkIns, checkIn],
        })),
      addGratitude: (item) =>
        set((state) => ({
          gratitude: [...state.gratitude, item],
        })),
      addGrowthLog: (log) =>
        set((state) => ({
          growthLogs: [...state.growthLogs, log],
        })),
    }),
    {
      name: 'journal-store',
    }
  )
);
