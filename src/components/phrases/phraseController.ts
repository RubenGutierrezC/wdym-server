import phraseRepository from './phraseRepository'
import { PhraseModel } from './phrase-interface'

const postPhrase = async (req: any, reply: any) => {
  try {
    if (typeof req.body.phrases !== 'string') {
      let phrases: Array<string> = req.body.phrases

      phrases.forEach(async (p: string) => {
        const thePhrase: PhraseModel = {
          phrase: p
        }
        await phraseRepository.createPhrase(thePhrase)
      })
    } else if (typeof req.body.phrases === 'string') {
      const thePhrase: PhraseModel = {
        phrase: req.body.phrases
      }
      await phraseRepository.createPhrase(thePhrase)
    }

    reply.code(200).send('Registro exitoso')
  } catch (error) {
    reply.send(error)
  }
}

const getPhrases = async (rep: any, reply: any) => {
  try {
    const data = await phraseRepository.findPhrases()

    reply.code(200).send(data)
  } catch (error) {
    reply.send(error)
  }
}

const getOnePhrase = async (req: any, reply: any) => {
  try {
    const data = await phraseRepository.findPhraseById(req.params.id)

    reply.code(200).send(data)
  } catch (error) {
    reply.send(error)
  }
}

const deleteAllPhrases = async (_req: any, reply: any) => {
  try {
    const data = await phraseRepository.deleteAllPhrases()

    reply.code(200).send(data)
  } catch (error) {
    reply.send(error)
  }
}

const phraseController = {
  postPhrase,
  getOnePhrase,
  getPhrases,
  deleteAllPhrases
}
export default phraseController
