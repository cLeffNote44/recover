/**
 * useRecoveryStore Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useRecoveryStore } from './useRecoveryStore';
import type { Setback } from '@/types/app';

describe('useRecoveryStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useRecoveryStore.getState();
    store.setRecoveryStartDate(new Date().toISOString().split('T')[0]);
    store.setSobrietyDate(new Date().toISOString().split('T')[0]);
    store.setSetbacks([]);
    store.setReasonsForSobriety([]);
    store.setUnlockedBadges([]);
    store.setCostPerDay(0);
    store.setCelebrationsEnabled(true);
  });

  it('should have initial state', () => {
    const state = useRecoveryStore.getState();

    expect(state.recoveryStartDate).toBeTruthy();
    expect(state.sobrietyDate).toBeTruthy();
    expect(state.setbacks).toEqual([]);
    expect(state.reasonsForSobriety).toEqual([]);
    expect(state.unlockedBadges).toEqual([]);
    expect(state.costPerDay).toBe(0);
    expect(state.celebrationsEnabled).toBe(true);
  });

  it('should set recovery start date', () => {
    const store = useRecoveryStore.getState();
    const newDate = '2024-01-01';

    store.setRecoveryStartDate(newDate);

    expect(useRecoveryStore.getState().recoveryStartDate).toBe(newDate);
  });

  it('should set sobriety date', () => {
    const store = useRecoveryStore.getState();
    const newDate = '2024-06-01';

    store.setSobrietyDate(newDate);

    expect(useRecoveryStore.getState().sobrietyDate).toBe(newDate);
  });

  it('should add setback', () => {
    const store = useRecoveryStore.getState();
    const setback: Setback = {
      id: '1',
      date: new Date().toISOString(),
      type: 'slip',
      notes: 'Test setback',
      triggers: ['stress'],
      lessons: 'Learned to manage stress better',
    };

    store.addSetback(setback);

    const state = useRecoveryStore.getState();
    expect(state.setbacks).toHaveLength(1);
    expect(state.setbacks[0]).toEqual(setback);
  });

  it('should add multiple setbacks', () => {
    const store = useRecoveryStore.getState();
    const setback1: Setback = {
      id: '1',
      date: new Date().toISOString(),
      type: 'slip',
      notes: 'First setback',
      triggers: ['stress'],
      lessons: 'Lesson 1',
    };
    const setback2: Setback = {
      id: '2',
      date: new Date().toISOString(),
      type: 'relapse',
      notes: 'Second setback',
      triggers: ['anxiety'],
      lessons: 'Lesson 2',
    };

    store.addSetback(setback1);
    store.addSetback(setback2);

    const state = useRecoveryStore.getState();
    expect(state.setbacks).toHaveLength(2);
    expect(state.setbacks[0]).toEqual(setback1);
    expect(state.setbacks[1]).toEqual(setback2);
  });

  it('should set all setbacks', () => {
    const store = useRecoveryStore.getState();
    const setbacks: Setback[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        type: 'slip',
        notes: 'First',
        triggers: [],
        lessons: '',
      },
      {
        id: '2',
        date: new Date().toISOString(),
        type: 'relapse',
        notes: 'Second',
        triggers: [],
        lessons: '',
      },
    ];

    store.setSetbacks(setbacks);

    expect(useRecoveryStore.getState().setbacks).toEqual(setbacks);
  });

  it('should set reasons for sobriety', () => {
    const store = useRecoveryStore.getState();
    const reasons = ['Health', 'Family', 'Career'];

    store.setReasonsForSobriety(reasons);

    expect(useRecoveryStore.getState().reasonsForSobriety).toEqual(reasons);
  });

  it('should add reason for sobriety', () => {
    const store = useRecoveryStore.getState();

    store.addReasonForSobriety('Health');
    store.addReasonForSobriety('Family');

    const state = useRecoveryStore.getState();
    expect(state.reasonsForSobriety).toHaveLength(2);
    expect(state.reasonsForSobriety).toContain('Health');
    expect(state.reasonsForSobriety).toContain('Family');
  });

  it('should set unlocked badges', () => {
    const store = useRecoveryStore.getState();
    const badges = ['day-1', 'week-1', 'month-1'];

    store.setUnlockedBadges(badges);

    expect(useRecoveryStore.getState().unlockedBadges).toEqual(badges);
  });

  it('should unlock badge', () => {
    const store = useRecoveryStore.getState();

    store.unlockBadge('day-1');
    store.unlockBadge('week-1');

    const state = useRecoveryStore.getState();
    expect(state.unlockedBadges).toHaveLength(2);
    expect(state.unlockedBadges).toContain('day-1');
    expect(state.unlockedBadges).toContain('week-1');
  });

  it('should not add duplicate badge', () => {
    const store = useRecoveryStore.getState();

    store.unlockBadge('day-1');
    store.unlockBadge('day-1');

    const state = useRecoveryStore.getState();
    expect(state.unlockedBadges).toHaveLength(1);
  });

  it('should set cost per day', () => {
    const store = useRecoveryStore.getState();

    store.setCostPerDay(15.5);

    expect(useRecoveryStore.getState().costPerDay).toBe(15.5);
  });

  it('should set celebrations enabled', () => {
    const store = useRecoveryStore.getState();

    store.setCelebrationsEnabled(false);
    expect(useRecoveryStore.getState().celebrationsEnabled).toBe(false);

    store.setCelebrationsEnabled(true);
    expect(useRecoveryStore.getState().celebrationsEnabled).toBe(true);
  });
});
