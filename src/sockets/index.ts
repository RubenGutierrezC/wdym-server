import { MemeModel } from '../components/memes/meme-interface'
import memeRepository from '../components/memes/memeRepository'
import { PhraseModel } from '../components/phrases/phrase-interface'
import phraseRepository from '../components/phrases/phraseRepository'
import { App, SocketConnected } from '../interfaces/globlal'
import {
  createRoom,
  joinRoom,
  getParticipantsInRoom,
  startGame,
  getRoomInfo,
  setCard,
  setWinCard,
  disconnect,
  reconnect
} from './methods'

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
        socket
      })
    })

    socket.on('start-game', (data: any, cb: any) => {
      startGame({
        data,
        cb,
        socket
      })
    })

    socket.on('get-room-info', (data: any, cb: any) => {
      getRoomInfo({
        data,
        cb
      })
    })

    socket.on('set-card', (data: any, cb: any) => {
      setCard({
        data,
        cb,
        socket
      })
    })

    socket.on('set-win-card', (data: any, cb: any) => {
      setWinCard({
        data,
        cb,
        socket,
        io: app?.io
      })
    })

    socket.on('reconnect', (data: any, cb) => {
      reconnect({
        data,
        cb,
        socket
      })
    })

    socket.on('disconnect', (reason) => {
      disconnect({
        socket
      })
    })
  })
}
