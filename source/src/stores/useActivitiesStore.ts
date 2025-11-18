/**
 * Activities Store
 *
 * Manages meetings, meditations, cravings, challenges, and calendar events
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Meeting, Meditation, Craving, Challenge, CalendarEvent } from '@/types/app';

interface ActivitiesState {
  // State
  meetings: Meeting[];
  meditations: Meditation[];
  cravings: Craving[];
  challenges: Challenge[];
  events: CalendarEvent[];

  // Actions
  setMeetings: (meetings: Meeting[]) => void;
  setMeditations: (meditations: Meditation[]) => void;
  setCravings: (cravings: Craving[]) => void;
  setChallenges: (challenges: Challenge[]) => void;
  setEvents: (events: CalendarEvent[]) => void;

  // Helpers
  addMeeting: (meeting: Meeting) => void;
  addMeditation: (meditation: Meditation) => void;
  addCraving: (craving: Craving) => void;
  addChallenge: (challenge: Challenge) => void;
  addEvent: (event: CalendarEvent) => void;
}

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set) => ({
      // Initial state
      meetings: [],
      meditations: [],
      cravings: [],
      challenges: [],
      events: [],

      // Actions
      setMeetings: (meetings) => set({ meetings }),
      setMeditations: (meditations) => set({ meditations }),
      setCravings: (cravings) => set({ cravings }),
      setChallenges: (challenges) => set({ challenges }),
      setEvents: (events) => set({ events }),

      // Helper methods
      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [...state.meetings, meeting],
        })),
      addMeditation: (meditation) =>
        set((state) => ({
          meditations: [...state.meditations, meditation],
        })),
      addCraving: (craving) =>
        set((state) => ({
          cravings: [...state.cravings, craving],
        })),
      addChallenge: (challenge) =>
        set((state) => ({
          challenges: [...state.challenges, challenge],
        })),
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
    }),
    {
      name: 'activities-store',
    }
  )
);
