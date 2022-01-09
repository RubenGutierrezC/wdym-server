import { SocketMethodProps } from '../../interfaces/globlal';

export interface JoinRoomProps {
  code: string;
  username: string;
  socketRooms: Map<string, Set<string>> | []
}

export interface JoinRoomResponse {
  msg: string
}

export const joinRoom = async (props: SocketMethodProps<JoinRoomProps, JoinRoomResponse>) => {
  const {  data, cb, socket} = props

  try {
    
    //   const availablesRooms = Array.from(app.io.sockets.adapter.rooms)

    //   const roomExist = availablesRooms.findIndex(el => el[0] === `room-${code}`) > -1

    //   if (roomExist) {
    //     socket.join(`room-${code}`)
    //     rooms[code].participants?.push({
    //       username,
    //       isRoomCreator: false,
    //       numberOfWinnings: 0,
    //       socketId: socket.id
    //     })
    //   }

    //   cb({
    //     msg: 'ok'
    //   })
    // })

    // socket.on('get-participants-in-waiting-rooms', ({ roomCode }, cb) => {
    //   try {

    //     const availablesRooms = Array.from(app.io.sockets.adapter.rooms)
    //     const roomExist = availablesRooms.findIndex(el => el[0] === `room-${roomCode}`) > -1

    //     let participants = []

    //     if (roomExist) {
    //       participants = rooms[roomCode].participants || []
    //     }

    //     cb({
    //       msg: 'ok',
    //       participants
    //     })

  } catch (error) {
    console.log(error)
  }

}