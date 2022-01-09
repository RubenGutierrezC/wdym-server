import { App, SocketConnected } from '../interfaces/globlal'
import { createRoom, joinRoom } from './methods'

export const initSocket = (app: App) => {
  app.io?.on('connection', (socket: SocketConnected) => {
    socket.on('create-room', (data: any, cb: any) =>
      createRoom({ data, cb, socket })
    )

    socket.on('join-room', (_: any, cb: any) =>
      joinRoom({
        cb,
        socket,
        rooms: app?.io?.sockets?.adapter?.rooms || []
      })
    )
  })
}
