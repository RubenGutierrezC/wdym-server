import { MemeModel } from '../components/memes/meme-interface'
import memeRepository from '../components/memes/memeRepository'
import { PhraseModel } from '../components/phrases/phrase-interface'
import phraseRepository from '../components/phrases/phraseRepository'
import { App, SocketConnected } from '../interfaces/globlal'
import { createRoom, joinRoom } from './methods'
import { getParticipantsInRoom } from './methods/getParcititpantsInRoom'

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
      joinRoom({
        data,
        cb,
        socket,
        io: app?.io
      })
    })

    socket.on('get-participants-in-room', (data: any, cb: any) => {
      getParticipantsInRoom({
        data,
        cb,
        socket,
        rooms: app?.io?.sockets?.adapter?.rooms
      })
    })
  })
}
