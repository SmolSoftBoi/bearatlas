import { Job } from 'bullmq';
import { enrichQueue } from '../index';
import { processExampleEvents } from '../adapters/example';

export async function ingestExample(job: Job) {
  console.log(`🔄 Starting ingest job ${job.id}`);
  
  try {
    const events = await processExampleEvents();
    console.log(`📥 Processed ${events.length} events from example adapter`);

    // Queue enrichment jobs for each event
    for (const event of events) {
      await enrichQueue.add('enrich', { event }, {
        removeOnComplete: 100,
        removeOnFail: 50,
      });
    }

    console.log(`✅ Queued ${events.length} events for enrichment`);
    return { processed: events.length };
  } catch (error) {
    console.error('❌ Ingest job failed:', error);
    throw error;
  }
}