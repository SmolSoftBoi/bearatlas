import 'dotenv/config';
import { PrismaClient, EventType } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const sources = [
    { code: 'BEARWEEK', name: 'Bear Week Directory', url: 'https://bearweek.example' },
    { code: 'BEARRUN', name: 'Bear Run Events', url: 'https://bearrun.example' }
  ];

  for (const source of sources) {
    await prisma.source.upsert({
      where: { code: source.code },
      update: source,
      create: source
    });
  }

  const sampleEvents = [
    {
      name: 'Berlin Bear Week 2025',
      type: EventType.WEEK,
      startsAt: new Date('2025-07-15T00:00:00Z'),
      endsAt: new Date('2025-07-22T00:00:00Z'),
      country: 'DE',
      region: 'Berlin',
      city: 'Berlin',
      source: 'BEARWEEK',
      vibe: ['dance', 'relax'],
      amenities: ['sauna', 'pool', 'bar'],
      clothingOptional: true,
      accessibility: { wheelchair: true, stepFree: true }
    }
  ];

  for (const event of sampleEvents) {
    const hash = crypto
      .createHash('sha1')
      .update(`${event.name}-${event.startsAt.toISOString()}-${event.country}`)
      .digest('hex');

    const durationDays = Math.max(
      1,
      Math.ceil((event.endsAt.getTime() - event.startsAt.getTime()) / (1000 * 60 * 60 * 24))
    );

    await prisma.event.upsert({
      where: { hash },
      update: {
        ...event,
        durationDays,
        lastChecked: new Date()
      },
      create: {
        ...event,
        durationDays,
        hash
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
