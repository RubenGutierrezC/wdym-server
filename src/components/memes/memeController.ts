import memeRepository from './memeRepository'
import { MemeModel } from './meme-interface'

const postMeme = async (req: any, reply: any) => {
  try {
    if (req.files.length > 0) {
      let meme = Array.from(req.files, (item: any) => item.url)

      meme.forEach(async (m: string) => {
        const elmeme: MemeModel = {
          img: m,
          status: true
        }
        await memeRepository.createMeme(elmeme)
      })

      reply.code(200).send('Registro exitoso')
    } else {
      reply.code(400).send('No data')
    }
  } catch (error) {
    reply.send(error)
  }
}

const getMemes = async (req: any, reply: any) => {
  try {
    const data = await memeRepository.findMemes()

    reply.code(200).send(data)
  } catch (error) {
    reply.send(error)
  }
}

const getOneMeme = async (req: any, reply: any) => {
  try {
    const data = await memeRepository.findMemeById(req.params.id)

    reply.code(200).send(data)
  } catch (error) {
    reply.send(error)
  }
}

const memeController = {
  postMeme,
  getMemes,
  getOneMeme
}
export default memeController
