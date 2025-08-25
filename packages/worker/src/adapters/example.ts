import { EventType, SizeBand, PriceBand } from '@prisma/client';

interface RawEvent {
  name: string;
  type: string;
  startsAt: string;
  endsAt: string;
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  venues: string[];
  estSize?: string;
  priceBand?: string;
  vibe: string[];
  clothingOptional: boolean;
  amenities: string[];
  links: any;
  sourceCode: string;
  sourceName: string;
}

export async function processExampleEvents(): Promise<RawEvent[]> {
  // Sample events for development
  const sampleEvents: RawEvent[] = [
    {
      name: 'Manchester Bear Week 2024',
      type: 'WEEK',
      startsAt: '2024-06-15T00:00:00Z',
      endsAt: '2024-06-22T23:59:59Z',
      country: 'United Kingdom',
      region: 'North West',
      city: 'Manchester',
      latitude: 53.4808,
      longitude: -2.2426,
      venues: ['G-A-Y', 'Cruz 101', 'The Eagle'],
      estSize: 'L',
      priceBand: '££',
      vibe: ['dance', 'social', 'leather'],
      clothingOptional: false,
      amenities: ['sauna', 'pool', 'gym'],
      links: {
        official: 'https://manchesterbearhunt.com/bear-week-2024',
        tickets: 'https://manchesterbearhunt.com/tickets',
        socials: ['https://facebook.com/manchesterbearhunt']
      },
      sourceCode: 'MBH',
      sourceName: 'Manchester Bear Hunt',
    },
    {
      name: 'Barcelona Bear Cruise',
      type: 'CRUISE',
      startsAt: '2024-07-20T00:00:00Z',
      endsAt: '2024-07-27T23:59:59Z',
      country: 'Spain',
      region: 'Catalonia',
      city: 'Barcelona',
      latitude: 41.3851,
      longitude: 2.1734,
      venues: ['Mediterranean Sea', 'Port of Barcelona'],
      estSize: 'M',
      priceBand: '£££',
      vibe: ['luxury', 'relax', 'social'],
      clothingOptional: true,
      amenities: ['pool', 'spa', 'restaurant'],
      links: {
        official: 'https://barcelonabearcruise.com',
        tickets: 'https://barcelonabearcruise.com/book',
        socials: ['https://instagram.com/barcelonabearcruise']
      },
      sourceCode: 'GT4U',
      sourceName: 'Gay Travel 4U',
    },
  ];

  return sampleEvents;
}