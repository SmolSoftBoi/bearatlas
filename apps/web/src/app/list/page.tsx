'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FiltersPanel from '@/components/FiltersPanel';
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
  facets: any;
}

export default function ListPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryString = searchParams.toString();
      const response = await fetch(`/api/events?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data: SearchResponse = await response.json();
      setEvents(data.hits.map(hit => hit.document));
      setTotal(data.total);
      setFacets(data.facets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={fetchEvents}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <div className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${total} events found`}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FiltersPanel facets={facets} />
        </div>

        {/* Events List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No events found</div>
              <p className="text-sm text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}