/**
 * useActivitiesStore Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useActivitiesStore } from './useActivitiesStore';
import type { Meeting, Meditation, Craving } from '@/types/app';

describe('useActivitiesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useActivitiesStore.getState();
    store.setMeetings([]);
    store.setMeditations([]);
    store.setCravings([]);
  });

  it('should have initial state', () => {
    const state = useActivitiesStore.getState();

    expect(state.meetings).toEqual([]);
    expect(state.meditations).toEqual([]);
    expect(state.cravings).toEqual([]);
  });

  describe('Meetings', () => {
    it('should add meeting', () => {
      const store = useActivitiesStore.getState();
      const meeting: Meeting = {
        id: '1',
        date: new Date().toISOString(),
        type: 'AA',
        notes: 'Great meeting',
      };

      store.addMeeting(meeting);

      const state = useActivitiesStore.getState();
      expect(state.meetings).toHaveLength(1);
      expect(state.meetings[0]).toEqual(meeting);
    });

    it('should set all meetings', () => {
      const store = useActivitiesStore.getState();
      const meetings: Meeting[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          type: 'AA',
          notes: 'First',
        },
        {
          id: '2',
          date: new Date().toISOString(),
          type: 'NA',
          notes: 'Second',
        },
      ];

      store.setMeetings(meetings);

      expect(useActivitiesStore.getState().meetings).toEqual(meetings);
    });
  });

  describe('Meditations', () => {
    it('should add meditation', () => {
      const store = useActivitiesStore.getState();
      const meditation: Meditation = {
        id: '1',
        date: new Date().toISOString(),
        duration: 10,
        type: 'mindfulness',
        notes: 'Peaceful session',
      };

      store.addMeditation(meditation);

      const state = useActivitiesStore.getState();
      expect(state.meditations).toHaveLength(1);
      expect(state.meditations[0]).toEqual(meditation);
    });

    it('should set all meditations', () => {
      const store = useActivitiesStore.getState();
      const meditations: Meditation[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          duration: 10,
          type: 'mindfulness',
        },
        {
          id: '2',
          date: new Date().toISOString(),
          duration: 20,
          type: 'breathing',
        },
      ];

      store.setMeditations(meditations);

      expect(useActivitiesStore.getState().meditations).toEqual(meditations);
    });
  });

  describe('Cravings', () => {
    it('should add craving', () => {
      const store = useActivitiesStore.getState();
      const craving: Craving = {
        id: '1',
        date: new Date().toISOString(),
        intensity: 7,
        trigger: 'stress',
        copingStrategy: 'meditation',
        outcome: 'overcome',
      };

      store.addCraving(craving);

      const state = useActivitiesStore.getState();
      expect(state.cravings).toHaveLength(1);
      expect(state.cravings[0]).toEqual(craving);
    });

    it('should set all cravings', () => {
      const store = useActivitiesStore.getState();
      const cravings: Craving[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          intensity: 7,
          trigger: 'stress',
          outcome: 'overcome',
        },
        {
          id: '2',
          date: new Date().toISOString(),
          intensity: 5,
          trigger: 'boredom',
          outcome: 'overcome',
        },
      ];

      store.setCravings(cravings);

      expect(useActivitiesStore.getState().cravings).toEqual(cravings);
    });
  });

  it('should handle multiple activities simultaneously', () => {
    const store = useActivitiesStore.getState();

    const meeting: Meeting = {
      id: '1',
      date: new Date().toISOString(),
      type: 'AA',
      notes: 'Meeting',
    };

    const meditation: Meditation = {
      id: '1',
      date: new Date().toISOString(),
      duration: 10,
      type: 'mindfulness',
    };

    const craving: Craving = {
      id: '1',
      date: new Date().toISOString(),
      intensity: 7,
      trigger: 'stress',
      outcome: 'overcome',
    };

    store.addMeeting(meeting);
    store.addMeditation(meditation);
    store.addCraving(craving);

    const state = useActivitiesStore.getState();
    expect(state.meetings).toHaveLength(1);
    expect(state.meditations).toHaveLength(1);
    expect(state.cravings).toHaveLength(1);
  });
});
