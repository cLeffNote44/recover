/**
 * Biometric Authentication Manager
 *
 * Handles Face ID, Touch ID, Fingerprint, and Face Unlock authentication
 * with PIN fallback for device security.
 */

import { Capacitor } from '@capacitor/core';

// Type imports don't require the actual module at runtime
type BiometricAuth = any;
type CheckBiometryResult = any;

export interface BiometricSettings {
  enabled: boolean;
  requireOnStartup: boolean;
  requireOnResume: boolean;
  timeoutMinutes: number;
  pinEnabled: boolean;
  pinHash?: string;
}

export interface BiometricAvailability {
  isAvailable: boolean;
  biometryType: 'none' | 'touchId' | 'faceId' | 'fingerprint' | 'face' | 'iris';
  reason?: string;
}

class BiometricAuthManager {
  private static instance: BiometricAuthManager;
  private settings: BiometricSettings;
  private lastAuthTime: number = 0;
  private isNative: boolean;

  private constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.settings = this.loadSettings();
  }

  public static getInstance(): BiometricAuthManager {
    if (!BiometricAuthManager.instance) {
      BiometricAuthManager.instance = new BiometricAuthManager();
    }
    return BiometricAuthManager.instance;
  }

  /**
   * Check if biometric authentication is available on this device
   */
  public async checkAvailability(): Promise<BiometricAvailability> {
    if (!this.isNative) {
      return {
        isAvailable: false,
        biometryType: 'none',
        reason: 'Biometric authentication only available on native platforms'
      };
    }

    try {
      // Dynamically import only on native platforms
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
      const result: CheckBiometryResult = await BiometricAuth.checkBiometry();

      // Map the BiometryType enum to our string types
      let mappedType: BiometricAvailability['biometryType'] = 'none';
      if (result.biometryType !== undefined && result.biometryType !== null) {
        const typeStr = String(result.biometryType).toLowerCase();
        if (typeStr.includes('touchid') || typeStr.includes('touch')) {
          mappedType = 'touchId';
        } else if (typeStr.includes('faceid')) {
          mappedType = 'faceId';
        } else if (typeStr.includes('face')) {
          mappedType = 'face';
        } else if (typeStr.includes('fingerprint')) {
          mappedType = 'fingerprint';
        } else if (typeStr.includes('iris')) {
          mappedType = 'iris';
        }
      }

      return {
        isAvailable: result.isAvailable,
        biometryType: mappedType,
        reason: result.reason
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        isAvailable: false,
        biometryType: 'none',
        reason: 'Error checking biometric availability'
      };
    }
  }

  /**
   * Authenticate using biometrics
   */
  public async authenticate(reason: string = 'Authenticate to unlock Recover'): Promise<boolean> {
    if (!this.isNative) {
      // On web, fall back to PIN if enabled
      if (this.settings.pinEnabled) {
        return false; // Will trigger PIN prompt
      }
      return true; // No auth on web
    }

    try {
      // Dynamically import only on native platforms
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
      await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Cancel',
        allowDeviceCredential: true, // Allow device PIN as fallback
        iosFallbackTitle: 'Use PIN',
        androidTitle: 'Authenticate',
        androidSubtitle: reason,
        androidConfirmationRequired: false
      });

      this.lastAuthTime = Date.now();
      return true;
    } catch (error) {
      // Check error type and handle accordingly
      const errorCode = (error as any)?.code;

      // User cancelled or failed auth (common error codes)
      if (errorCode === 10 || errorCode === 13 || errorCode === 'USER_CANCEL') {
        return false;
      }

      // Biometrics not available, fall back to PIN
      if (this.settings.pinEnabled) {
        return false; // Will trigger PIN prompt
      }

      return false;
    }
  }

  /**
   * Check if authentication is required based on timeout
   */
  public isAuthRequired(): boolean {
    if (!this.settings.enabled) {
      return false;
    }

    // Check if timeout has expired
    const timeoutMs = this.settings.timeoutMinutes * 60 * 1000;
    const timeSinceAuth = Date.now() - this.lastAuthTime;

    return timeSinceAuth > timeoutMs;
  }

  /**
   * Validate PIN
   */
  public validatePin(pin: string): boolean {
    if (!this.settings.pinHash) {
      return false;
    }

    const pinHash = this.hashPin(pin);
    const isValid = pinHash === this.settings.pinHash;

    if (isValid) {
      this.lastAuthTime = Date.now();
    }

    return isValid;
  }

  /**
   * Set or update PIN
   */
  public setPin(pin: string): void {
    this.settings.pinHash = this.hashPin(pin);
    this.settings.pinEnabled = true;
    this.saveSettings();
  }

  /**
   * Remove PIN
   */
  public removePin(): void {
    this.settings.pinHash = undefined;
    this.settings.pinEnabled = false;
    this.saveSettings();
  }

  /**
   * Hash PIN for storage (simple hash - in production use bcrypt or similar)
   */
  private hashPin(pin: string): string {
    // Simple hash for demo - in production, use proper crypto library
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Update settings
   */
  public updateSettings(settings: Partial<BiometricSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  public getSettings(): BiometricSettings {
    return { ...this.settings };
  }

  /**
   * Enable biometric authentication
   */
  public async enable(): Promise<boolean> {
    const availability = await this.checkAvailability();

    if (!availability.isAvailable) {
      return false;
    }

    this.settings.enabled = true;
    this.saveSettings();
    return true;
  }

  /**
   * Disable biometric authentication
   */
  public disable(): void {
    this.settings.enabled = false;
    this.saveSettings();
  }

  /**
   * Mark as authenticated (for testing or manual override)
   */
  public markAuthenticated(): void {
    this.lastAuthTime = Date.now();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): BiometricSettings {
    const stored = localStorage.getItem('biometric-settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading biometric settings:', error);
      }
    }

    // Default settings
    return {
      enabled: false,
      requireOnStartup: true,
      requireOnResume: true,
      timeoutMinutes: 5,
      pinEnabled: false
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('biometric-settings', JSON.stringify(this.settings));
  }

  /**
   * Clear authentication state (for logout)
   */
  public clearAuthState(): void {
    this.lastAuthTime = 0;
  }
}

// Export singleton instance
export const biometricAuthManager = BiometricAuthManager.getInstance();

// Export helper functions for convenience
export const checkBiometricAvailability = () => biometricAuthManager.checkAvailability();
export const authenticateBiometric = (reason?: string) => biometricAuthManager.authenticate(reason);
export const isAuthRequired = () => biometricAuthManager.isAuthRequired();
export const validatePin = (pin: string) => biometricAuthManager.validatePin(pin);
export const setPin = (pin: string) => biometricAuthManager.setPin(pin);
export const removePin = () => biometricAuthManager.removePin();
export const getBiometricSettings = () => biometricAuthManager.getSettings();
export const updateBiometricSettings = (settings: Partial<BiometricSettings>) =>
  biometricAuthManager.updateSettings(settings);
