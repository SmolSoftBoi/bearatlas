import IORedis, { Redis } from 'ioredis';

export function createClient(): Redis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = new IORedis(url);
  return client;
}
