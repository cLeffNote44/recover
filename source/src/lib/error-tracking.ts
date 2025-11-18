/**
 * Error Tracking
 *
 * Centralized error tracking and reporting
 * Ready for Sentry integration
 */

export interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: ErrorContext;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
}

// Store errors locally for debugging
const errorLog: ErrorReport[] = [];
const MAX_ERROR_LOG_SIZE = 100;

/**
 * Initialize error tracking
 *
 * To use Sentry:
 * 1. Install @sentry/react: npm install @sentry/react
 * 2. Uncomment Sentry initialization
 * 3. Add VITE_SENTRY_DSN to .env
 */
export function initErrorTracking(): void {
  // Sentry initialization (uncomment when ready to use)
  /*
  import * as Sentry from '@sentry/react';

  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
  */

  // Global error handler
  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), {
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        extra: {
          reason: event.reason,
          promise: event.promise,
        },
      }
    );
  });

  if (import.meta.env.DEV) {
    console.log('[ErrorTracking] Initialized');
  }
}

/**
 * Capture an error
 */
export function captureError(
  error: Error | string,
  context?: ErrorContext
): void {
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  const report: ErrorReport = {
    message: errorObj.message,
    stack: errorObj.stack,
    context,
    timestamp: Date.now(),
    level: 'error',
  };

  // Add to local log
  errorLog.push(report);
  if (errorLog.length > MAX_ERROR_LOG_SIZE) {
    errorLog.shift();
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ErrorTracking]', report);
  }

  // Send to Sentry (if configured)
  /*
  if (window.Sentry) {
    window.Sentry.captureException(errorObj, {
      tags: context?.tags,
      extra: context?.extra,
      user: context?.user,
    });
  }
  */
}

/**
 * Capture a warning
 */
export function captureWarning(
  message: string,
  context?: ErrorContext
): void {
  const report: ErrorReport = {
    message,
    context,
    timestamp: Date.now(),
    level: 'warning',
  };

  errorLog.push(report);
  if (errorLog.length > MAX_ERROR_LOG_SIZE) {
    errorLog.shift();
  }

  if (import.meta.env.DEV) {
    console.warn('[ErrorTracking]', report);
  }

  /*
  if (window.Sentry) {
    window.Sentry.captureMessage(message, {
      level: 'warning',
      tags: context?.tags,
      extra: context?.extra,
      user: context?.user,
    });
  }
  */
}

/**
 * Capture an info message
 */
export function captureInfo(
  message: string,
  context?: ErrorContext
): void {
  const report: ErrorReport = {
    message,
    context,
    timestamp: Date.now(),
    level: 'info',
  };

  errorLog.push(report);
  if (errorLog.length > MAX_ERROR_LOG_SIZE) {
    errorLog.shift();
  }

  if (import.meta.env.DEV) {
    console.info('[ErrorTracking]', report);
  }

  /*
  if (window.Sentry) {
    window.Sentry.captureMessage(message, {
      level: 'info',
      tags: context?.tags,
      extra: context?.extra,
      user: context?.user,
    });
  }
  */
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id?: string; email?: string }): void {
  /*
  if (window.Sentry) {
    window.Sentry.setUser(user);
  }
  */

  if (import.meta.env.DEV) {
    console.log('[ErrorTracking] User context set:', user);
  }
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  /*
  if (window.Sentry) {
    window.Sentry.setUser(null);
  }
  */
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, any>
): void {
  /*
  if (window.Sentry) {
    window.Sentry.addBreadcrumb({
      message,
      data,
      timestamp: Date.now() / 1000,
    });
  }
  */

  if (import.meta.env.DEV) {
    console.log('[ErrorTracking] Breadcrumb:', message, data);
  }
}

/**
 * Get error log (for debugging)
 */
export function getErrorLog(): ErrorReport[] {
  return [...errorLog];
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
  errorLog.length = 0;
}

/**
 * Export error log as JSON
 */
export function exportErrorLog(): string {
  return JSON.stringify(errorLog, null, 2);
}

// Type augmentation for Sentry
declare global {
  interface Window {
    Sentry?: {
      init: (config: any) => void;
      captureException: (error: Error, context?: any) => void;
      captureMessage: (message: string, context?: any) => void;
      setUser: (user: any) => void;
      addBreadcrumb: (breadcrumb: any) => void;
    };
  }
}
