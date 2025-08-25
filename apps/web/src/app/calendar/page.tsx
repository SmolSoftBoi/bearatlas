'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import EventCard from '@/components/EventCard';

interface Event {
  id: string;
  name: string;
  type: string;
  startsAt: number;
  endsAt: number;
  durationDays: number;
  country: string;
  region?: string;
  city?: string;
  estSize?: string;
  priceBand?: string;
  vibe: string[];
  clothingOptional: boolean;
  amenities: string[];
  links: any;
  sourceName: string;
  sourceCode: string;
}

interface SearchResponse {
  hits: Array<{ document: Event }>;
  total: number;
}

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryString = searchParams.toString();
      const response = await fetch(`/api/events?${queryString}&limit=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data: SearchResponse = await response.json();
      setEvents(data.hits.map(hit => hit.document));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startsAt);
      const eventEnd = new Date(event.endsAt);
      return eventStart <= date && eventEnd >= date;
    });
  };

  const getEventsForMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => ({
      date: day,
      events: getEventsForDate(day)
    }));
  };

  const handleExportICS = () => {
    const queryString = searchParams.toString();
    window.open(`/api/calendar.ics?${queryString}`, '_blank');
  };

  const monthData = getEventsForMonth();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button
          onClick={handleExportICS}
          className="btn btn-primary"
        >
          Export Calendar (.ics)
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="btn btn-secondary"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {monthData.map(({ date, events }) => (
                <div
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    p-2 min-h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                    ${!isSameMonth(date, currentMonth) ? 'bg-gray-50 text-gray-400' : ''}
                    ${selectedDate && isSameDay(date, selectedDate) ? 'bg-blue-50 border-blue-300' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(date, 'd')}
                  </div>
                  {events.length > 0 && (
                    <div className="space-y-1">
                      {events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                          title={event.name}
                        >
                          {event.name}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDate ? (
              selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-1">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.city}, {event.country}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.type}
                        </span>
                        {event.priceBand && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {event.priceBand}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events on this date</p>
              )
            ) : (
              <p className="text-gray-500">Click on a date to view events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}