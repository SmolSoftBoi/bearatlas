import { Job } from 'bullmq';
import { prisma } from './db';
import { typesense } from './typesense';

export async function indexToTypesense(job: Job) {
  console.log(`🔄 Starting index job ${job.id}`);
  
  try {
    const { event } = job.data;
    
    // Upsert to database
    const dbEvent = await prisma.event.upsert({
      where: { hash: event.hash },
      update: {
        ...event,
        updatedAt: new Date(),
      },
      create: event,
    });

    console.log(`💾 Stored event in database: ${dbEvent.name}`);

    // Index to Typesense
    const typesenseEvent = {
      id: dbEvent.id,
      name: dbEvent.name,
      type: dbEvent.type,
      startsAt: dbEvent.startsAt.getTime(),
      endsAt: dbEvent.endsAt.getTime(),
      durationDays: dbEvent.durationDays,
      country: dbEvent.country,
      region: dbEvent.region,
      city: dbEvent.city,
      estSize: dbEvent.estSize,
      priceBand: dbEvent.priceBand,
      vibe: dbEvent.vibe,
      clothingOptional: dbEvent.clothingOptional,
      amenities: dbEvent.amenities,
      latitude: dbEvent.latitude,
      longitude: dbEvent.longitude,
      venues: dbEvent.venues,
      links: dbEvent.links,
      sourceId: dbEvent.sourceId,
      sourceName: event.sourceName,
      sourceCode: event.sourceCode,
    };

    await typesense.collections('events').documents().upsert(typesenseEvent);
    console.log(`🔍 Indexed event in Typesense: ${dbEvent.name}`);

    return { event: dbEvent };
  } catch (error) {
    console.error('❌ Index job failed:', error);
    throw error;
  }
}