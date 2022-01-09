import { App, SocketConnected } from '../interfaces/globlal';
import { createRoom, joinRoom } from './methods';

export const initSocket = (app: App) => {
  app.io?.on('connection', (socket: SocketConnected) => {


    app.io.sockets.adapter.rooms

    socket.on('create-room', (data: any, cb: any) =>
      createRoom({ data, cb, socket })
    )

    socket.on('join-room', (data: any, cb: any) => 
      joinRoom({
        data, cb, socket,
      })
    )

  })
}