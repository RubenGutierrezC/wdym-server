import { SocketMethodProps } from '../../interfaces/globlal'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'

interface JoinRoomProps {
  code: string
  username: string
}

type JoinRoomResponse = SocketResponse<{
  message: string
} | null>

interface JoinRoomAditionaProps {
  rooms: Map<string, Set<string>> | any
}

export const joinRoom = async (
  props: SocketMethodProps<null, JoinRoomResponse, JoinRoomAditionaProps>
) => {
  const { cb, socket, rooms } = props

  console.log(rooms)

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

    cb &&
      cb(
        socketOkReponse({
          message: 'ok'
        })
      )
  } catch (error) {
    cb && cb(socketErrorResponse(error))
  }
}
