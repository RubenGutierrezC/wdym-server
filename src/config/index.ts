import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 5000

export const MONGO_URL = process.env.MONGO_URL || ''

export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || ''
export const REDIS_PORT = process.env.REDIS_PORT || ''
export const REDIS_USERNAME = process.env.REDIS_USERNAME || ''

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
