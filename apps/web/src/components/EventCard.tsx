'use client';

import { format } from 'date-fns';
import { EventFilters } from '@/lib/filters';

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

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className = '' }: EventCardProps) {
  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);

  const handleSaveToCalendar = () => {
    const url = `/api/calendar.ics?id=${event.id}`;
    window.open(url, '_blank');
  };

  const handleViewTickets = () => {
    if (event.links?.tickets) {
      window.open(event.links.tickets, '_blank');
    }
  };

  const handleViewOfficial = () => {
    if (event.links?.official) {
      window.open(event.links.official, '_blank');
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{format(startDate, 'MMM d')}</span>
            <span>-</span>
            <span>{format(endDate, 'MMM d, yyyy')}</span>
            <span>•</span>
            <span>{event.durationDays} days</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {event.type}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {event.sourceCode}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📍</span>
          <span>
            {[event.city, event.region, event.country].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2">
          {event.estSize && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Size: {event.estSize}
            </span>
          )}
          {event.priceBand && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Price: {event.priceBand}
            </span>
          )}
          {event.clothingOptional && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Clothing Optional
            </span>
          )}
        </div>

        {/* Vibe tags */}
        {event.vibe.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.vibe.map((vibe) => (
              <span
                key={vibe}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {vibe}
              </span>
            ))}
          </div>
        )}

        {/* Amenities */}
        {event.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={handleViewOfficial}
            className="btn btn-secondary text-sm"
          >
            View Official Site
          </button>
          {event.links?.tickets && (
            <button
              onClick={handleViewTickets}
              className="btn btn-primary text-sm"
            >
              Get Tickets
            </button>
          )}
          <button
            onClick={handleSaveToCalendar}
            className="btn btn-secondary text-sm"
          >
            Save to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}