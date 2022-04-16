import { memeModel } from './memeModel'
import { MemeModel } from './meme-interface'
import { ObjectId } from 'mongoose'

const createMeme = async (m: MemeModel) => {
  const { img } = m

  const data = new memeModel({
    img
  })

  return data.save()
}

const findApprovedMemes = async () => {
  const data = await memeModel.find({ isApproved: true }).limit(100)

  return data
}

const findMemes = async () => {
  const data = await memeModel.find().limit(100)

  return data
}

const findMemeById = async (id: ObjectId) => {
  const data = await memeModel.findById(id)

  return data
}

const memeRepository = {
  createMeme,
  findApprovedMemes,
  findMemes,
  findMemeById
}

export default memeRepository
