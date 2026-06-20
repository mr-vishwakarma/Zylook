// Redis client configuration
// Will be implemented when Redis is needed for caching and rate limiting

import { createClient } from 'redis';

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => console.error('Redis error:', err));
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.warn('⚠️  Redis not available — running without cache');
  }
};

export { redisClient, connectRedis };
