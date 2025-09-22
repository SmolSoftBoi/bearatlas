import 'dotenv/config';
import { exampleQueue } from './index.js';

async function main(): Promise<void> {
  const job = await exampleQueue.add('hello', { now: new Date().toISOString() });
  console.log('Queued job', job.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
