import { ObjectId } from 'mongoose'
import { PhraseModel } from './phrase-interface'
import { phraseModel } from './phraseModel'

const createPhrase = async (p: PhraseModel) => {
  const { phrase } = p

  const data = new phraseModel({
    phrase
  })

  return data.save()
}

const findPhrases = async () => {
  const data = await phraseModel.find().limit(100)

  return data
}

const findPhraseById = async (id: ObjectId) => {
  const data = await phraseModel.findById(id)

  return data
}

const phraseRepository = {
  createPhrase,
  findPhraseById,
  findPhrases
}

export default phraseRepository
