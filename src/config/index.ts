import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 5000

export const MONGO_URL = process.env.MONGO_URL || ''

export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || ''
export const REDIS_PORT = process.env.REDIS_PORT || ''
export const REDIS_USERNAME = process.env.REDIS_USERNAME || ''

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

export const FirsebaseStorageCredentials = {
  type: process.env.STORAGE_TYPE,
  toke_url: process.env.STORAGE_TOKEN_URL,
  client_email: process.env.STORAGE_CLIENT_EMAIL,
  client_id: process.env.STORAGE_CLIENT_ID,
  private_key: process.env.STORAGE_PRIVATE_KEY?.replace(/\\n/g, '\n')
}
