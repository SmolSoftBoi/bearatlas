import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sources
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { code: 'MBH' },
      update: {},
      create: {
        code: 'MBH',
        name: 'Manchester Bear Hunt',
        url: 'https://manchesterbearhunt.com',
      },
    }),
    prisma.source.upsert({
      where: { code: 'BEARCAL' },
      update: {},
      create: {
        code: 'BEARCAL',
        name: 'Bear Calendar',
        url: 'https://bearcalendar.com',
      },
    }),
    prisma.source.upsert({
      where: { code: 'GT4U' },
      update: {},
      create: {
        code: 'GT4U',
        name: 'Gay Travel 4U',
        url: 'https://gaytravel4u.com',
      },
    }),
  ]);

  console.log('✅ Sources created');

  // Create sample events
  const events = [
    {
      name: 'Manchester Bear Week 2024',
      type: 'WEEK' as const,
      startsAt: new Date('2024-06-15'),
      endsAt: new Date('2024-06-22'),
      durationDays: 8,
      country: 'United Kingdom',
      region: 'North West',
      city: 'Manchester',
      latitude: 53.4808,
      longitude: -2.2426,
      venues: ['G-A-Y', 'Cruz 101', 'The Eagle'],
      estSize: 'L' as const,
      priceBand: '££' as const,
      vibe: ['dance', 'social', 'leather'],
      clothingOptional: false,
      amenities: ['sauna', 'pool', 'gym'],
      links: {
        official: 'https://manchesterbearhunt.com/bear-week-2024',
        tickets: 'https://manchesterbearhunt.com/tickets',
        socials: ['https://facebook.com/manchesterbearhunt']
      },
      sourceId: sources[0].id,
    },
    {
      name: 'Barcelona Bear Cruise',
      type: 'CRUISE' as const,
      startsAt: new Date('2024-07-20'),
      endsAt: new Date('2024-07-27'),
      durationDays: 8,
      country: 'Spain',
      region: 'Catalonia',
      city: 'Barcelona',
      latitude: 41.3851,
      longitude: 2.1734,
      venues: ['Mediterranean Sea', 'Port of Barcelona'],
      estSize: 'M' as const,
      priceBand: '£££' as const,
      vibe: ['luxury', 'relax', 'social'],
      clothingOptional: true,
      amenities: ['pool', 'spa', 'restaurant'],
      links: {
        official: 'https://barcelonabearcruise.com',
        tickets: 'https://barcelonabearcruise.com/book',
        socials: ['https://instagram.com/barcelonabearcruise']
      },
      sourceId: sources[2].id,
    },
    {
      name: 'Berlin Bear Run',
      type: 'RUN' as const,
      startsAt: new Date('2024-08-10'),
      endsAt: new Date('2024-08-12'),
      durationDays: 3,
      country: 'Germany',
      region: 'Berlin',
      city: 'Berlin',
      latitude: 52.5200,
      longitude: 13.4050,
      venues: ['Tiergarten', 'Olympiastadion'],
      estSize: 'XL' as const,
      priceBand: '£' as const,
      vibe: ['sport', 'outdoor', 'social'],
      clothingOptional: false,
      amenities: ['gym', 'shower'],
      links: {
        official: 'https://berlinbearrun.de',
        tickets: 'https://berlinbearrun.de/register',
        socials: ['https://facebook.com/berlinbearrun']
      },
      sourceId: sources[1].id,
    },
    {
      name: 'Provincetown Bear Resort Week',
      type: 'RESORT' as const,
      startsAt: new Date('2024-09-15'),
      endsAt: new Date('2024-09-22'),
      durationDays: 8,
      country: 'United States',
      region: 'Massachusetts',
      city: 'Provincetown',
      latitude: 42.0587,
      longitude: -70.1787,
      venues: ['Bear Week Resort', 'Commercial Street'],
      estSize: 'L' as const,
      priceBand: '£££' as const,
      vibe: ['resort', 'beach', 'luxury'],
      clothingOptional: true,
      amenities: ['pool', 'sauna', 'beach', 'restaurant'],
      links: {
        official: 'https://ptownbearweek.com',
        tickets: 'https://ptownbearweek.com/book',
        socials: ['https://instagram.com/ptownbearweek']
      },
      sourceId: sources[0].id,
    },
    {
      name: 'Amsterdam Bear Party',
      type: 'PARTY' as const,
      startsAt: new Date('2024-10-05'),
      endsAt: new Date('2024-10-06'),
      durationDays: 2,
      country: 'Netherlands',
      region: 'North Holland',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041,
      venues: ['Paradiso', 'Melkweg'],
      estSize: 'M' as const,
      priceBand: '££' as const,
      vibe: ['dance', 'party', 'music'],
      clothingOptional: false,
      amenities: ['bar', 'dancefloor'],
      links: {
        official: 'https://amsterdambearparty.nl',
        tickets: 'https://amsterdambearparty.nl/tickets',
        socials: ['https://facebook.com/amsterdambearparty']
      },
      sourceId: sources[1].id,
    },
  ];

  for (const eventData of events) {
    // Generate hash for deduplication
    const hashInput = `${eventData.name}-${eventData.startsAt.toISOString()}-${eventData.endsAt.toISOString()}-${eventData.latitude}-${eventData.longitude}`;
    const hash = createHash('sha1').update(hashInput).digest('hex');

    await prisma.event.upsert({
      where: { hash },
      update: {},
      create: {
        ...eventData,
        hash,
      },
    });
  }

  console.log('✅ Events created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });