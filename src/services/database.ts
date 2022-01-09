import mongoose, { ConnectOptions } from 'mongoose'
import { MONGO_URL } from '../config/index';

export const initMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
    console.log('conected to mongoDB')
  } catch (error) {
    console.error(error)
  }
}

