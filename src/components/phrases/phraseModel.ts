import mongoose from 'mongoose'
import { PhraseModel } from './phrase-interface'

const { model, Schema } = mongoose

const PhraseSchema = new Schema<PhraseModel>({
  phrase: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
})

export const phraseModel = model<PhraseModel>('Phrase', PhraseSchema)
