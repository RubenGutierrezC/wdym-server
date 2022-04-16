import { model, Schema } from 'mongoose'
import { MemeModel } from './meme-interface'

const MemeSchema = new Schema<MemeModel>({
  img: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
})

export const memeModel = model<MemeModel>('Meme', MemeSchema)
