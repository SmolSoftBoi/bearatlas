import { ingestQueue } from './index';

async function main() {
  console.log('🚀 Enqueuing example ingest job...');
  
  try {
    await ingestQueue.add('ingest:example', {}, {
      removeOnComplete: 10,
      removeOnFail: 5,
    });
    
    console.log('✅ Ingest job enqueued successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to enqueue ingest job:', error);
    process.exit(1);
  }
}

main();