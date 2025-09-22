import 'dotenv/config';
import { Queue, Worker } from 'bullmq';
import { createClient } from './lib/redis.js';

const connection = createClient();

export const exampleQueue = new Queue('example', { connection });

new Worker(
  'example',
  async (job) => {
    // Minimal worker for dev parity
    return { processed: true, id: job.id };
  },
  { connection }
);

console.log('Worker started');
