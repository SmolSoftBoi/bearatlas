'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  latitude: number;
  longitude: number;
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

declare global {
  interface Window {
    mapkit: any;
  }
}

export default function MapPage() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapToken, setMapToken] = useState<string | null>(null);

  const fetchMapToken = async () => {
    try {
      const response = await fetch('/api/apple-maps-token');
      const data = await response.json();
      setMapToken(data.token);
    } catch (error) {
      console.error('Failed to fetch map token:', error);
    }
  };

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

  const initializeMap = () => {
    if (!mapRef.current || !mapToken || !window.mapkit) return;

    try {
      window.mapkit.init({
        authorizationCallback: (done: any) => {
          done(mapToken);
        }
      });

      const map = new window.mapkit.Map(mapRef.current, {
        region: new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(40.7128, -74.0060), // Default to NYC
          new window.mapkit.CoordinateSpan(10, 10)
        ),
        showsUserLocation: true,
        showsUserLocationControl: true,
      });

      mapInstanceRef.current = map;

      // Add event pins
      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const coordinate = new window.mapkit.Coordinate(event.latitude, event.longitude);
          const annotation = new window.mapkit.MarkerAnnotation(coordinate, {
            title: event.name,
            subtitle: `${event.city}, ${event.country}`,
            calloutEnabled: true,
            callout: {
              calloutContentForAnnotation: () => {
                const div = document.createElement('div');
                div.innerHTML = `
                  <div class="p-2">
                    <h3 class="font-semibold">${event.name}</h3>
                    <p class="text-sm text-gray-600">${event.city}, ${event.country}</p>
                    <p class="text-sm text-gray-600">${event.type} • ${event.durationDays} days</p>
                  </div>
                `;
                return div;
              }
            }
          });

          annotation.addEventListener('select', () => {
            setSelectedEvent(event);
          });

          map.addAnnotation(annotation);
        }
      });

      // Fit map to show all events
      if (events.length > 0) {
        const coordinates = events
          .filter(event => event.latitude && event.longitude)
          .map(event => new window.mapkit.Coordinate(event.latitude, event.longitude));

        if (coordinates.length > 0) {
          const region = window.mapkit.CoordinateRegion.regionForAnnotations(coordinates);
          map.setRegionAnimated(region, true);
        }
      }
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  };

  useEffect(() => {
    fetchMapToken();
  }, []);

  useEffect(() => {
    if (mapToken) {
      initializeMap();
    }
  }, [mapToken, events]);

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Map View</h1>
        <div className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${events.length} events`}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div 
              ref={mapRef} 
              className="w-full h-96"
              style={{ minHeight: '400px' }}
            >
              {!mapToken && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">Loading map...</div>
                    <div className="text-sm text-gray-400">
                      Make sure you have configured Apple Maps credentials
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Event Details */}
        <div className="lg:col-span-1">
          {selectedEvent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <EventCard event={selectedEvent} />
            </div>
          ) : (
            <div className="card">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">🗺️</div>
                <p>Click on a map pin to view event details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MapKit JS Script */}
      <script
        src="https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js"
        async
        onLoad={() => {
          if (mapToken) {
            initializeMap();
          }
        }}
      />
    </div>
  );
}