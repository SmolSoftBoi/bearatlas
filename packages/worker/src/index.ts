import { Queue, Worker } from 'bullmq';
import { redis } from './redis';
import { ingestExample } from './jobs/ingest';
import { enrichEvent } from './jobs/enrich';
import { indexToTypesense } from './jobs/index';

// Create queues
export const ingestQueue = new Queue('ingest', { connection: redis });
export const enrichQueue = new Queue('enrich', { connection: redis });
export const indexQueue = new Queue('index', { connection: redis });

// Create workers
const ingestWorker = new Worker('ingest', ingestExample, { connection: redis });
const enrichWorker = new Worker('enrich', enrichEvent, { connection: redis });
const indexWorker = new Worker('index', indexToTypesense, { connection: redis });

// Handle worker events
ingestWorker.on('completed', (job) => {
  console.log(`✅ Ingest job ${job.id} completed`);
});

ingestWorker.on('failed', (job, err) => {
  console.error(`❌ Ingest job ${job?.id} failed:`, err);
});

enrichWorker.on('completed', (job) => {
  console.log(`✅ Enrich job ${job.id} completed`);
});

enrichWorker.on('failed', (job, err) => {
  console.error(`❌ Enrich job ${job?.id} failed:`, err);
});

indexWorker.on('completed', (job) => {
  console.log(`✅ Index job ${job.id} completed`);
});

indexWorker.on('failed', (job, err) => {
  console.error(`❌ Index job ${job?.id} failed:`, err);
});

console.log('🚀 BearAtlas Worker started');
console.log('📊 Queues: ingest, enrich, index');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down workers...');
  await ingestWorker.close();
  await enrichWorker.close();
  await indexWorker.close();
  await redis.quit();
  process.exit(0);
});