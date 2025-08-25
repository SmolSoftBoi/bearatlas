'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface WizardData {
  startDate: string;
  endDate: string;
  location: string;
  radius: number;
  vibe: string[];
  budget: string;
  size: string;
}

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    startDate: '',
    endDate: '',
    location: '',
    radius: 100,
    vibe: [],
    budget: '',
    size: '',
  });
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const vibeOptions = ['dance', 'social', 'leather', 'luxury', 'relax', 'sport', 'outdoor', 'party', 'music'];
  const budgetOptions = ['£', '££', '£££'];
  const sizeOptions = ['S', 'M', 'L', 'XL'];

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (wizardData.startDate) params.set('start', wizardData.startDate);
      if (wizardData.endDate) params.set('end', wizardData.endDate);
      if (wizardData.location) params.set('q', wizardData.location);
      if (wizardData.budget) params.set('priceBand', wizardData.budget);
      if (wizardData.size) params.set('estSize', wizardData.size);
      wizardData.vibe.forEach(vibe => params.append('vibe', vibe));

      const response = await fetch(`/api/events?${params.toString()}&limit=20`);
      const data: SearchResponse = await response.json();
      setResults(data.hits.map(hit => hit.document));
    } catch (error) {
      console.error('Failed to search events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (wizardData.startDate) params.set('start', wizardData.startDate);
    if (wizardData.endDate) params.set('end', wizardData.endDate);
    if (wizardData.location) params.set('q', wizardData.location);
    if (wizardData.budget) params.set('priceBand', wizardData.budget);
    if (wizardData.size) params.set('estSize', wizardData.size);
    wizardData.vibe.forEach(vibe => params.append('vibe', vibe));
    
    router.push(`/list?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Wizard</h1>
        <p className="text-gray-600">Plan your perfect bear trip in 3 easy steps</p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          {step === 1 && 'Step 1: When are you traveling?'}
          {step === 2 && 'Step 2: Where do you want to go?'}
          {step === 3 && 'Step 3: What\'s your vibe?'}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">When are you traveling?</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={wizardData.startDate}
                    onChange={(e) => updateWizardData({ startDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={wizardData.endDate}
                    onChange={(e) => updateWizardData({ endDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!wizardData.startDate || !wizardData.endDate}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Where do you want to go?</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (city, country, or region)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Barcelona, Spain"
                  value={wizardData.location}
                  onChange={(e) => updateWizardData({ location: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {wizardData.radius}km
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={wizardData.radius}
                  onChange={(e) => updateWizardData({ radius: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={handleBack} className="btn btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!wizardData.location}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">What's your vibe?</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vibe (select all that apply)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vibeOptions.map((vibe) => (
                    <label key={vibe} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={wizardData.vibe.includes(vibe)}
                        onChange={(e) => {
                          const newVibes = e.target.checked
                            ? [...wizardData.vibe, vibe]
                            : wizardData.vibe.filter(v => v !== vibe);
                          updateWizardData({ vibe: newVibes });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{vibe}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <select
                    value={wizardData.budget}
                    onChange={(e) => updateWizardData({ budget: e.target.value })}
                    className="select"
                  >
                    <option value="">Any Budget</option>
                    {budgetOptions.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Size
                  </label>
                  <select
                    value={wizardData.size}
                    onChange={(e) => updateWizardData({ size: e.target.value })}
                    className="select"
                  >
                    <option value="">Any Size</option>
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleBack} className="btn btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Searching...' : 'Find My Trip'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Perfect Trip ({results.length} events found)
            </h2>
            <button onClick={handleViewAll} className="btn btn-secondary">
              View All Results
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}