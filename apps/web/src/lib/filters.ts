export interface EventFilters {
  q?: string;
  country?: string;
  region?: string;
  city?: string;
  type?: string;
  estSize?: string;
  priceBand?: string;
  vibe?: string[];
  clothingOptional?: boolean;
  amenities?: string[];
  start?: string;
  end?: string;
  limit?: number;
}

export function buildTypesenseFilters(filters: EventFilters): string {
  const filterParts: string[] = [];

  if (filters.country) {
    filterParts.push(`country:=${filters.country}`);
  }

  if (filters.region) {
    filterParts.push(`region:=${filters.region}`);
  }

  if (filters.city) {
    filterParts.push(`city:=${filters.city}`);
  }

  if (filters.type) {
    filterParts.push(`type:=${filters.type}`);
  }

  if (filters.estSize) {
    filterParts.push(`estSize:=${filters.estSize}`);
  }

  if (filters.priceBand) {
    filterParts.push(`priceBand:=${filters.priceBand}`);
  }

  if (filters.vibe && filters.vibe.length > 0) {
    const vibeFilters = filters.vibe.map(vibe => `vibe:=${vibe}`);
    filterParts.push(`(${vibeFilters.join(' || ')})`);
  }

  if (filters.clothingOptional !== undefined) {
    filterParts.push(`clothingOptional:=${filters.clothingOptional}`);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    const amenityFilters = filters.amenities.map(amenity => `amenities:=${amenity}`);
    filterParts.push(`(${amenityFilters.join(' || ')})`);
  }

  if (filters.start) {
    const startTime = new Date(filters.start).getTime();
    filterParts.push(`startsAt:>=${startTime}`);
  }

  if (filters.end) {
    const endTime = new Date(filters.end).getTime();
    filterParts.push(`endsAt:<=${endTime}`);
  }

  return filterParts.join(' && ');
}

export function parseUrlFilters(searchParams: URLSearchParams): EventFilters {
  return {
    q: searchParams.get('q') || undefined,
    country: searchParams.get('country') || undefined,
    region: searchParams.get('region') || undefined,
    city: searchParams.get('city') || undefined,
    type: searchParams.get('type') || undefined,
    estSize: searchParams.get('estSize') || undefined,
    priceBand: searchParams.get('priceBand') || undefined,
    vibe: searchParams.getAll('vibe'),
    clothingOptional: searchParams.get('clothingOptional') === 'true',
    amenities: searchParams.getAll('amenities'),
    start: searchParams.get('start') || undefined,
    end: searchParams.get('end') || undefined,
    limit: parseInt(searchParams.get('limit') || '20'),
  };
}

export function buildUrlFromFilters(filters: EventFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, String(value));
      }
    }
  });

  return params.toString();
}