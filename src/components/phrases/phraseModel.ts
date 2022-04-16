import { model, Schema } from 'mongoose'
import { PhraseModel } from './phrase-interface'

const PhraseSchema = new Schema<PhraseModel>({
  phrase: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'es',
    enum: ['es', 'en']
  },
  isApproved: {
    type: Boolean,
    default: false
  }
})

export const phraseModel = model<PhraseModel>('Phrase', PhraseSchema)
