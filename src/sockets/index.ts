import { App, SocketConnected } from '../interfaces/globlal'
import { createRoom, joinRoom } from './methods'
import { getParticipantsInRoom } from './methods/getParcititpantsInRoom'

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
        rooms: app?.io?.sockets?.adapter?.rooms,
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
