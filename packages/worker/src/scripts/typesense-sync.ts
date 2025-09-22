import 'dotenv/config';
import { prisma } from '../lib/db.js';
import { createTypesenseClient, eventsSchema, EVENTS_COLLECTION } from '../lib/typesense.js';

async function ensureCollection(client: ReturnType<typeof createTypesenseClient>): Promise<void> {
  try {
    await client.collections(EVENTS_COLLECTION).retrieve();
    // If exists, drop and recreate to keep schema simple for now
    await client.collections(EVENTS_COLLECTION).delete();
  } catch {
    // Not found: safe to create
  }
  await client.collections().create(eventsSchema as any);
}

async function run(): Promise<void> {
  const client = createTypesenseClient();
  await ensureCollection(client);

  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      startsAt: true,
      endsAt: true,
      country: true,
      region: true,
      city: true,
      vibe: true,
      amenities: true
    },
    orderBy: { startsAt: 'asc' }
  });

  const documents = events.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    startsAt: Math.floor(new Date(e.startsAt).getTime()),
    endsAt: Math.floor(new Date(e.endsAt).getTime()),
    country: e.country,
    region: e.region ?? '',
    city: e.city ?? '',
    vibe: Array.isArray(e.vibe) ? e.vibe : [],
    amenities: Array.isArray(e.amenities) ? e.amenities : []
  }));

  if (documents.length) {
    await client
      .collections(EVENTS_COLLECTION)
      .documents()
      .import(documents, { action: 'upsert' });
  }

  console.log(`Synced ${documents.length} events to Typesense`);
}

run().catch((err) => {
  console.error('Typesense sync failed', err);
  process.exit(1);
});
