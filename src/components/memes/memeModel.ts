import mongoose from 'mongoose'
import { MemeModel } from './meme-interface'

const { model, Schema } = mongoose

const MemeSchema = new Schema<MemeModel>({
  img: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
})

export const memeModel = model<MemeModel>('Meme', MemeSchema)
