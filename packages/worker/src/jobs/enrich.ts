import { Job } from 'bullmq';
import { indexQueue } from '../index';
import { normalizeEvent, computeHash } from '../pipeline';

export async function enrichEvent(job: Job) {
  console.log(`🔄 Starting enrich job ${job.id}`);
  
  try {
    const { event } = job.data;
    
    // Normalize the event
    const normalizedEvent = await normalizeEvent(event);
    
    // Compute hash for deduplication
    const hash = computeHash(normalizedEvent);
    
    const enrichedEvent = {
      ...normalizedEvent,
      hash,
      lastChecked: new Date(),
    };

    // Queue for indexing
    await indexQueue.add('index', { event: enrichedEvent }, {
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    console.log(`✅ Enriched event: ${enrichedEvent.name}`);
    return { event: enrichedEvent };
  } catch (error) {
    console.error('❌ Enrich job failed:', error);
    throw error;
  }
}