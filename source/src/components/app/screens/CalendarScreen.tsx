import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/EmptyState';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Repeat, Bell, X, Edit, Trash2 } from 'lucide-react';
import { CalendarEvent, EventType } from '@/types/app';
import { toast } from 'sonner';
import { getEventsForDate, getEventsInRange, formatEventTime, getRecurringDescription } from '@/lib/calendar-utils';

export function CalendarScreen() {
  const { events, setEvents } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ date: string; dayNumber: number } | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'other' as EventType,
    reminders: []
  });

  // Recurring event state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [recurringInterval, setRecurringInterval] = useState(1);
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);

  // Reminder state
  const [reminderMinutes, setReminderMinutes] = useState<number[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getEventsForDate(events, dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay({ date: dateStr, dayNumber: day });
  };

  // Get upcoming events (including recurring instances)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    return getEventsInRange(events, today, twoMonthsLater).slice(0, 20);
  }, [events]);

  const toggleDayOfWeek = (day: number) => {
    setSelectedDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleReminder = (minutes: number) => {
    setReminderMinutes(prev =>
      prev.includes(minutes) ? prev.filter(m => m !== minutes) : [...prev, minutes]
    );
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in required fields');
      return;
    }

    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type || 'other',
      reminders: reminderMinutes.map(minutes => ({ minutes })),
      recurring: isRecurring ? {
        frequency: recurringFrequency,
        interval: recurringInterval,
        endDate: recurringEndDate || undefined,
        daysOfWeek: recurringFrequency === 'weekly' ? selectedDaysOfWeek : undefined,
        dayOfMonth: recurringFrequency === 'monthly' ? new Date(newEvent.date).getDate() : undefined,
        monthOfYear: recurringFrequency === 'yearly' ? new Date(newEvent.date).getMonth() + 1 : undefined,
        excludedDates: []
      } : undefined
    };

    setEvents([...events, event]);

    // Reset form
    setShowAddEvent(false);
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'other',
      reminders: []
    });
    setIsRecurring(false);
    setRecurringFrequency('weekly');
    setRecurringInterval(1);
    setRecurringEndDate('');
    setSelectedDaysOfWeek([]);
    setReminderMinutes([]);

    const recurringText = isRecurring ? ` (${getRecurringDescription(event)})` : '';
    toast.success(`Event "${newEvent.title}" added to calendar${recurringText}!`);
  };

  const handleDeleteEvent = (eventId: number, specificDate?: string) => {
    const event = events.find(e => e.id === eventId);

    if (event?.recurring && specificDate) {
      // For recurring events with a specific date, add to excluded dates
      const updatedEvent = {
        ...event,
        recurring: {
          ...event.recurring,
          excludedDates: [...(event.recurring.excludedDates || []), specificDate]
        }
      };
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
      toast.success('Event removed from this day only');
      setSelectedDay(null);
    } else if (event?.recurring) {
      // For recurring events without specific date, ask if they want to delete all
      if (confirm('Delete all occurrences of this recurring event?')) {
        setEvents(events.filter(e => e.id !== eventId));
        toast.success('Recurring event deleted');
      }
    } else {
      // For non-recurring events, just delete
      setEvents(events.filter(e => e.id !== eventId));
      toast.success('Event removed from calendar');
      setSelectedDay(null);
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <Button onClick={() => setShowAddEvent(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Month Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-lg font-semibold">{monthName}</h3>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {dayLabels.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().getDate() === day &&
                             new Date().getMonth() === currentMonth.getMonth() &&
                             new Date().getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square p-1 border rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                    isToday ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div
                          key={`${event.id}-${idx}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            event.type === 'meeting' ? 'bg-blue-500' :
                            event.type === 'appointment' ? 'bg-green-500' :
                            event.type === 'reminder' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[8px] text-muted-foreground">+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Upcoming Events</h3>
        {upcomingEvents.map((event, idx) => (
          <Card key={`${event.id}-${idx}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                      {event.time && ` at ${formatEventTime(event.time)}`}
                    </span>
                  </div>
                  <h4 className="font-semibold">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}

                  {/* Recurring badge */}
                  {event.recurring && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        <Repeat className="w-3 h-3" />
                        {getRecurringDescription(event)}
                      </div>
                    </div>
                  )}

                  {/* Reminders badge */}
                  {event.reminders && event.reminders.length > 0 && (
                    <div className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full mt-2 w-fit">
                      <Bell className="w-3 h-3" />
                      {event.reminders.length} reminder{event.reminders.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.parentEventId || event.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {upcomingEvents.length === 0 && (
          <EmptyState
            icon={CalendarIcon}
            title="No Upcoming Events"
            description="Stay organized by adding important dates like meetings, therapy appointments, group sessions, or personal milestones. Never miss an important event in your recovery journey."
            actionLabel="Add First Event"
            onAction={() => setShowAddEvent(true)}
            iconColor="text-blue-500"
          />
        )}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          date={selectedDay.date}
          dayNumber={selectedDay.dayNumber}
          events={events}
          onClose={() => setSelectedDay(null)}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={setEditingEvent}
        />
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <AddEventModal
          onClose={() => setShowAddEvent(false)}
          events={events}
          setEvents={setEvents}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          recurringFrequency={recurringFrequency}
          setRecurringFrequency={setRecurringFrequency}
          recurringInterval={recurringInterval}
          setRecurringInterval={setRecurringInterval}
          recurringEndDate={recurringEndDate}
          setRecurringEndDate={setRecurringEndDate}
          selectedDaysOfWeek={selectedDaysOfWeek}
          toggleDayOfWeek={toggleDayOfWeek}
          reminderMinutes={reminderMinutes}
          toggleReminder={toggleReminder}
          handleAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
}

// Day Detail Modal Component
function DayDetailModal({
  date,
  dayNumber,
  events,
  onClose,
  onDeleteEvent,
  onEditEvent
}: {
  date: string;
  dayNumber: number;
  events: CalendarEvent[];
  onClose: () => void;
  onDeleteEvent: (eventId: number, specificDate?: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
}) {
  const dayEvents = getEventsForDate(events, date);
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10">
          <CardTitle className="text-lg">{formattedDate}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No events on this day</p>
            </div>
          ) : (
            dayEvents.map((event, idx) => (
              <Card key={`${event.id}-${idx}`} className="border-2">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {event.time && (
                            <span className="text-sm font-medium text-primary">
                              {formatEventTime(event.time)}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            event.type === 'meeting' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            event.type === 'appointment' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            event.type === 'reminder' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}

                        {/* Recurring indicator */}
                        {event.recurring && (
                          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 mt-2">
                            <Repeat className="w-3 h-3" />
                            <span>Recurring event</span>
                          </div>
                        )}

                        {/* Reminders */}
                        {event.reminders && event.reminders.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Bell className="w-3 h-3" />
                            {event.reminders.map(r => {
                              if (r.minutes === 0) return 'At time';
                              if (r.minutes < 60) return `${r.minutes}min before`;
                              if (r.minutes < 1440) return `${r.minutes / 60}hr before`;
                              return `${r.minutes / 1440}day before`;
                            }).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      {event.recurring ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteEvent(event.parentEventId || event.id, date)}
                          className="flex-1"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Skip This Day
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteEvent(event.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add Event Modal Component (extracted for cleaner code)
function AddEventModal({
  onClose,
  events,
  setEvents,
  newEvent,
  setNewEvent,
  isRecurring,
  setIsRecurring,
  recurringFrequency,
  setRecurringFrequency,
  recurringInterval,
  setRecurringInterval,
  recurringEndDate,
  setRecurringEndDate,
  selectedDaysOfWeek,
  toggleDayOfWeek,
  reminderMinutes,
  toggleReminder,
  handleAddEvent
}: any) {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add Event</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title *</label>
            <Input
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Meeting, appointment, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Date *</label>
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select
              value={newEvent.type}
              onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Options */}
          <div className="space-y-3 border-t pt-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
              <label htmlFor="recurring" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                <Repeat className="w-4 h-4" />
                Recurring Event
              </label>
            </div>

            {isRecurring && (
              <div className="space-y-3 pl-6 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Frequency</label>
                    <Select
                      value={recurringFrequency}
                      onValueChange={(value: any) => setRecurringFrequency(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Every</label>
                    <Input
                      type="number"
                      min="1"
                      max="99"
                      value={recurringInterval}
                      onChange={(e) => setRecurringInterval(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {recurringFrequency === 'weekly' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Repeat on</label>
                    <div className="flex gap-2 flex-wrap">
                      {dayLabels.map((day, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          variant={selectedDaysOfWeek.includes(idx) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleDayOfWeek(idx)}
                          className="w-12 h-10"
                        >
                          {day[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">End Date (optional)</label>
                  <Input
                    type="date"
                    value={recurringEndDate}
                    onChange={(e) => setRecurringEndDate(e.target.value)}
                    min={newEvent.date}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reminders */}
          <div className="space-y-3 border-t pt-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Reminders
            </label>
            <div className="space-y-2">
              {[
                { label: 'At time of event', value: 0 },
                { label: '15 minutes before', value: 15 },
                { label: '30 minutes before', value: 30 },
                { label: '1 hour before', value: 60 },
                { label: '1 day before', value: 1440 }
              ].map(({ label, value }) => (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`reminder-${value}`}
                    checked={reminderMinutes.includes(value)}
                    onCheckedChange={() => toggleReminder(value)}
                  />
                  <label htmlFor={`reminder-${value}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description (optional)</label>
            <Textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newEvent.title}
              className="flex-1"
            >
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
