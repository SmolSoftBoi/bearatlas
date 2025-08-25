'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventFilters, parseUrlFilters, buildUrlFromFilters } from '@/lib/filters';

interface FiltersPanelProps {
  facets?: any;
  className?: string;
}

export default function FiltersPanel({ facets, className = '' }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<EventFilters>(parseUrlFilters(searchParams));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilters(parseUrlFilters(searchParams));
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const queryString = buildUrlFromFilters(updatedFilters);
    router.push(`?${queryString}`);
  };

  const clearFilters = () => {
    router.push('/list');
  };

  const eventTypes = ['WEEK', 'RUN', 'CRUISE', 'RESORT', 'PARTY'];
  const sizeBands = ['S', 'M', 'L', 'XL'];
  const priceBands = ['£', '££', '£££'];
  const commonVibes = ['dance', 'social', 'leather', 'luxury', 'relax', 'sport', 'outdoor', 'party', 'music'];
  const commonAmenities = ['sauna', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'beach', 'dancefloor'];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            {isOpen ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.q || ''}
              onChange={(e) => updateFilters({ q: e.target.value })}
              className="input"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.start || ''}
                onChange={(e) => updateFilters({ start: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.end || ''}
                onChange={(e) => updateFilters({ end: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => updateFilters({ type: e.target.value || undefined })}
              className="select"
            >
              <option value="">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Size Band */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              value={filters.estSize || ''}
              onChange={(e) => updateFilters({ estSize: e.target.value || undefined })}
              className="select"
            >
              <option value="">Any Size</option>
              {sizeBands.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Price Band */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <select
              value={filters.priceBand || ''}
              onChange={(e) => updateFilters({ priceBand: e.target.value || undefined })}
              className="select"
            >
              <option value="">Any Price</option>
              {priceBands.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          {/* Vibe Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {commonVibes.map((vibe) => {
                const isSelected = filters.vibe?.includes(vibe);
                return (
                  <button
                    key={vibe}
                    onClick={() => {
                      const currentVibes = filters.vibe || [];
                      const newVibes = isSelected
                        ? currentVibes.filter(v => v !== vibe)
                        : [...currentVibes, vibe];
                      updateFilters({ vibe: newVibes });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity) => {
                const isSelected = filters.amenities?.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => {
                      const currentAmenities = filters.amenities || [];
                      const newAmenities = isSelected
                        ? currentAmenities.filter(a => a !== amenity)
                        : [...currentAmenities, amenity];
                      updateFilters({ amenities: newAmenities });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clothing Optional */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.clothingOptional || false}
                onChange={(e) => updateFilters({ clothingOptional: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Clothing Optional</span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="w-full btn btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}