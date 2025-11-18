import { CalendarEvent } from '@/types/app';

/**
 * Generate recurring event instances for a date range
 */
export function generateRecurringInstances(
  event: CalendarEvent,
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  if (!event.recurring) return [];

  const instances: CalendarEvent[] = [];
  const { frequency, interval, endDate: recurrenceEndDate, daysOfWeek, dayOfMonth, monthOfYear } = event.recurring;

  const eventDate = new Date(event.date);
  const maxEndDate = recurrenceEndDate ? new Date(recurrenceEndDate) : endDate;

  let currentDate = new Date(eventDate);

  // Don't generate instances before the event start date
  if (currentDate < startDate) {
    currentDate = new Date(startDate);
  }

  let iterationCount = 0;
  const maxIterations = 1000; // Safety limit

  while (currentDate <= maxEndDate && currentDate <= endDate && iterationCount < maxIterations) {
    iterationCount++;

    let shouldInclude = false;

    switch (frequency) {
      case 'daily':
        // For daily, check if we're on the right interval
        const daysDiff = Math.floor((currentDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
        shouldInclude = daysDiff >= 0 && daysDiff % interval === 0;
        break;

      case 'weekly':
        // For weekly, check if we're on the right day of week and interval
        if (daysOfWeek && daysOfWeek.length > 0) {
          const currentDayOfWeek = currentDate.getDay();
          const weeksDiff = Math.floor((currentDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
          shouldInclude = daysOfWeek.includes(currentDayOfWeek) && weeksDiff >= 0 && weeksDiff % interval === 0;
        }
        break;

      case 'monthly':
        // For monthly, check if we're on the right day of month and interval
        const targetDay = dayOfMonth || eventDate.getDate();
        const monthsDiff = (currentDate.getFullYear() - eventDate.getFullYear()) * 12 +
                          (currentDate.getMonth() - eventDate.getMonth());

        // Handle months with fewer days (e.g., Feb 30 -> Feb 28/29)
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const adjustedTargetDay = Math.min(targetDay, daysInMonth);

        shouldInclude = currentDate.getDate() === adjustedTargetDay &&
                       monthsDiff >= 0 &&
                       monthsDiff % interval === 0;
        break;

      case 'yearly':
        // For yearly, check if we're on the right month and day
        const targetMonth = (monthOfYear || (eventDate.getMonth() + 1)) - 1; // Convert to 0-indexed
        const targetDayOfMonth = dayOfMonth || eventDate.getDate();
        const yearsDiff = currentDate.getFullYear() - eventDate.getFullYear();

        shouldInclude = currentDate.getMonth() === targetMonth &&
                       currentDate.getDate() === targetDayOfMonth &&
                       yearsDiff >= 0 &&
                       yearsDiff % interval === 0;
        break;
    }

    if (shouldInclude && currentDate >= startDate) {
      const dateStr = currentDate.toISOString().split('T')[0];

      // Skip if this date is in the excluded dates list
      if (event.recurring?.excludedDates && event.recurring.excludedDates.includes(dateStr)) {
        // Don't add this instance
      } else {
        instances.push({
          ...event,
          id: Date.now() + iterationCount, // Unique ID for instance
          date: dateStr,
          isRecurringInstance: true,
          parentEventId: event.id
        });
      }
    }

    // Move to next date based on frequency
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'monthly':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'yearly':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
    }
  }

  return instances;
}

/**
 * Get all events for a specific date (including recurring instances)
 */
export function getEventsForDate(
  events: CalendarEvent[],
  date: string
): CalendarEvent[] {
  const targetDate = new Date(date);
  const dateStr = targetDate.toISOString().split('T')[0];

  const regularEvents = events.filter(e => !e.recurring && e.date === dateStr);

  const recurringEvents = events.filter(e => e.recurring);
  const recurringInstances = recurringEvents.flatMap(event => {
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);
    return generateRecurringInstances(event, startDate, endDate);
  });

  return [...regularEvents, ...recurringInstances];
}

/**
 * Get all events in a date range (including recurring instances)
 */
export function getEventsInRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  const regularEvents = events.filter(e => {
    if (e.recurring) return false;
    const eventDate = new Date(e.date);
    return eventDate >= startDate && eventDate <= endDate;
  });

  const recurringEvents = events.filter(e => e.recurring);
  const recurringInstances = recurringEvents.flatMap(event =>
    generateRecurringInstances(event, startDate, endDate)
  );

  return [...regularEvents, ...recurringInstances].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Get upcoming events with reminders
 */
export function getUpcomingReminders(
  events: CalendarEvent[],
  currentDate: Date,
  lookAheadHours: number = 24
): Array<{ event: CalendarEvent; reminderMinutes: number; reminderTime: Date }> {
  const endDate = new Date(currentDate.getTime() + lookAheadHours * 60 * 60 * 1000);
  const allEvents = getEventsInRange(events, currentDate, endDate);

  const reminders: Array<{ event: CalendarEvent; reminderMinutes: number; reminderTime: Date }> = [];

  allEvents.forEach(event => {
    if (!event.reminders || event.reminders.length === 0) return;

    // Parse event date and time
    const eventDate = new Date(event.date);
    if (event.time) {
      const [hours, minutes] = event.time.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      // Default to 9 AM if no time specified
      eventDate.setHours(9, 0, 0, 0);
    }

    event.reminders.forEach(reminder => {
      const reminderTime = new Date(eventDate.getTime() - reminder.minutes * 60 * 1000);

      // Only include reminders that are in the future
      if (reminderTime > currentDate && reminderTime <= endDate) {
        reminders.push({
          event,
          reminderMinutes: reminder.minutes,
          reminderTime
        });
      }
    });
  });

  return reminders.sort((a, b) => a.reminderTime.getTime() - b.reminderTime.getTime());
}

/**
 * Format time for display
 */
export function formatEventTime(time?: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get human-readable recurring description
 */
export function getRecurringDescription(event: CalendarEvent): string {
  if (!event.recurring) return '';

  const { frequency, interval, daysOfWeek, endDate } = event.recurring;

  let description = '';

  if (interval === 1) {
    switch (frequency) {
      case 'daily':
        description = 'Daily';
        break;
      case 'weekly':
        if (daysOfWeek && daysOfWeek.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const days = daysOfWeek.map(d => dayNames[d]).join(', ');
          description = `Weekly on ${days}`;
        } else {
          description = 'Weekly';
        }
        break;
      case 'monthly':
        description = 'Monthly';
        break;
      case 'yearly':
        description = 'Yearly';
        break;
    }
  } else {
    switch (frequency) {
      case 'daily':
        description = `Every ${interval} days`;
        break;
      case 'weekly':
        description = `Every ${interval} weeks`;
        if (daysOfWeek && daysOfWeek.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const days = daysOfWeek.map(d => dayNames[d]).join(', ');
          description += ` on ${days}`;
        }
        break;
      case 'monthly':
        description = `Every ${interval} months`;
        break;
      case 'yearly':
        description = `Every ${interval} years`;
        break;
    }
  }

  if (endDate) {
    description += ` until ${new Date(endDate).toLocaleDateString()}`;
  }

  return description;
}
