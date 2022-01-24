import { MemeModel } from '../components/memes/meme-interface'
import memeRepository from '../components/memes/memeRepository'
import { PhraseModel } from '../components/phrases/phrase-interface'
import phraseRepository from '../components/phrases/phraseRepository'
import { App, SocketConnected } from '../interfaces/globlal'
import { createRoom, joinRoom } from './methods'

export let memes: Array<MemeModel>
export let phrases: Array<PhraseModel>

export const initialize = async () => {
  memes = await memeRepository.findMemes()
  phrases = await phraseRepository.findPhrases()
}

export const initSocket = (app: App) => {
  app.io?.on('connection', (socket: SocketConnected) => {
    console.log('socket connected', socket.id)

    socket.on('create-room', (data: any, cb: any) =>
      createRoom({ data, cb, socket })
    )

    socket.on('join-room', (data: any, cb: any) => {
      console.log(app?.io?.sockets?.adapter?.rooms)

      joinRoom({
        data,
        cb,
        socket,
        rooms: app?.io?.sockets?.adapter?.rooms,
        io: app?.io
      })
    })
  })
}
