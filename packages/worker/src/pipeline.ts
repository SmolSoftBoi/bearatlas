import { createHash } from 'crypto';
import { prisma } from './db';
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

interface NormalizedEvent {
  name: string;
  type: EventType;
  startsAt: Date;
  endsAt: Date;
  durationDays: number;
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  venues: string[];
  estSize?: SizeBand;
  priceBand?: PriceBand;
  vibe: string[];
  clothingOptional: boolean;
  amenities: string[];
  links: any;
  sourceId: string;
  sourceName: string;
  sourceCode: string;
}

export async function normalizeEvent(rawEvent: RawEvent): Promise<NormalizedEvent> {
  // Get or create source
  const source = await prisma.source.upsert({
    where: { code: rawEvent.sourceCode },
    update: {},
    create: {
      code: rawEvent.sourceCode,
      name: rawEvent.sourceName,
      url: rawEvent.links?.official || '',
    },
  });

  // Calculate duration
  const startDate = new Date(rawEvent.startsAt);
  const endDate = new Date(rawEvent.endsAt);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Normalize enums
  const type = rawEvent.type as EventType;
  const estSize = rawEvent.estSize as SizeBand | undefined;
  const priceBand = rawEvent.priceBand as PriceBand | undefined;

  return {
    name: rawEvent.name,
    type,
    startsAt: startDate,
    endsAt: endDate,
    durationDays,
    country: rawEvent.country,
    region: rawEvent.region,
    city: rawEvent.city,
    latitude: rawEvent.latitude,
    longitude: rawEvent.longitude,
    venues: rawEvent.venues,
    estSize,
    priceBand,
    vibe: rawEvent.vibe,
    clothingOptional: rawEvent.clothingOptional,
    amenities: rawEvent.amenities,
    links: rawEvent.links,
    sourceId: source.id,
    sourceName: source.name,
    sourceCode: source.code,
  };
}

export function computeHash(event: NormalizedEvent): string {
  // Create a unique hash based on event properties
  const hashInput = `${event.name}-${event.startsAt.toISOString()}-${event.endsAt.toISOString()}-${event.latitude}-${event.longitude}`;
  return createHash('sha1').update(hashInput).digest('hex');
}