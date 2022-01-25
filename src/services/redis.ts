import { createClient } from 'redis'
import {
  REDIS_HOSTNAME,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME
} from '../config'

export const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOSTNAME}:${REDIS_PORT}/0`
})

export let redisJson: any = null

redisClient.on('error', (err) => console.log('Redis Client Error', err))
redisClient.on('connect', () => {
  console.log('redis client connected')
})
