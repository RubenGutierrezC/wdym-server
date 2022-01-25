import { Server } from 'socket.io'
import { SocketMethodProps } from '../../interfaces/globlal'
import { addParticipantToRoom, findRoomByCode } from '../rooms'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
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
  roomCode: string
} | null>

interface JoinRoomAditionaProps {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

export const joinRoom = async (
  props: SocketMethodProps<
    JoinRoomProps,
    JoinRoomResponse,
    JoinRoomAditionaProps
  >
) => {
  const { data, cb, socket, io } = props
  try {
    const room = await findRoomByCode(data.code)

    if (!room) {
      return cb && cb(socketErrorResponse('Room not found'))
    }

    socket?.join(`room-${data.code}`)

    await addParticipantToRoom({
      username: data.username,
      roomCode: data.code,
      socketId: socket?.id || ''
    })

    io?.to(`room-${data.code}`).emit('participant-joined', {
      username: data.username
    })

    cb &&
      cb(
        socketOkReponse({
          roomCode: data.code
        })
      )
  } catch (error) {
    console.log(error)
    cb && cb(socketErrorResponse(error))
  }
}
