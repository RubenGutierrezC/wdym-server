import { App, SocketConnected } from '../interfaces/globlal'
import { createRoom, joinRoom } from './methods'

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
