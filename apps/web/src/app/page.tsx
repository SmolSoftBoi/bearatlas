'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/list?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickFilters = [
    { name: 'Bear Weeks', href: '/list?type=WEEK' },
    { name: 'Bear Runs', href: '/list?type=RUN' },
    { name: 'Bear Cruises', href: '/list?type=CRUISE' },
    { name: 'Resorts', href: '/list?type=RESORT' },
    { name: 'Parties', href: '/list?type=PARTY' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Discover Bear Events Worldwide
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the perfect bear event, week, run, cruise, resort, or party with our comprehensive travel index.
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search events, cities, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Quick Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Filters</h2>
        <div className="flex flex-wrap gap-3">
          {quickFilters.map((filter) => (
            <a
              key={filter.name}
              href={filter.href}
              className="btn btn-secondary"
            >
              {filter.name}
            </a>
          ))}
        </div>
      </div>

      {/* View Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/map" className="card hover:shadow-md transition-shadow">
          <div className="text-center space-y-3">
            <div className="text-3xl">🗺️</div>
            <h3 className="font-semibold text-gray-900">Map View</h3>
            <p className="text-sm text-gray-600">Explore events on an interactive map</p>
          </div>
        </a>
        
        <a href="/list" className="card hover:shadow-md transition-shadow">
          <div className="text-center space-y-3">
            <div className="text-3xl">📋</div>
            <h3 className="font-semibold text-gray-900">List View</h3>
            <p className="text-sm text-gray-600">Browse events with advanced filters</p>
          </div>
        </a>
        
        <a href="/calendar" className="card hover:shadow-md transition-shadow">
          <div className="text-center space-y-3">
            <div className="text-3xl">📅</div>
            <h3 className="font-semibold text-gray-900">Calendar</h3>
            <p className="text-sm text-gray-600">View events in calendar format</p>
          </div>
        </a>
        
        <a href="/wizard" className="card hover:shadow-md transition-shadow">
          <div className="text-center space-y-3">
            <div className="text-3xl">🧙</div>
            <h3 className="font-semibold text-gray-900">Trip Wizard</h3>
            <p className="text-sm text-gray-600">Plan your perfect bear trip</p>
          </div>
        </a>
      </div>

      {/* Features */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Why BearAtlas?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Comprehensive Database</h3>
            <p className="text-sm text-gray-600">
              Aggregated events from multiple sources with ethical data collection.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Advanced Filtering</h3>
            <p className="text-sm text-gray-600">
              Filter by date, location, type, size, price, vibe, and amenities.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Multiple Views</h3>
            <p className="text-sm text-gray-600">
              Map, list, calendar, and wizard views for different planning needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}