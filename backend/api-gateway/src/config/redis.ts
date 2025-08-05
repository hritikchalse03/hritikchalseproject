import Redis from 'ioredis';
import { config } from './config';

let redis: Redis;

export async function connectRedis() {
  try {
    redis = new Redis(config.redis.url, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    redis.on('connect', () => {
      console.log('✅ Redis connection established');
    });

    redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    redis.on('ready', () => {
      console.log('✅ Redis is ready');
    });

    redis.on('close', () => {
      console.log('⚠️ Redis connection closed');
    });

    // Test the connection
    await redis.ping();
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

export async function disconnectRedis() {
  try {
    if (redis) {
      await redis.quit();
      console.log('✅ Redis connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing Redis connection:', error);
    throw error;
  }
}

export { redis };