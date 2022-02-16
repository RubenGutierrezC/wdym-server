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
  roomCode: string
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
    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    socket?.join(`room-${data.roomCode}`)

    const { username, roomCode } = data

    await addParticipantToRoom({
      username,
      roomCode,
      socketId: socket?.id || ''
    })

    io?.to(`room-${data.roomCode}`).emit('participant-joined', {
      username
    })

    cb?.(
      socketOkReponse({
        roomCode
      })
    )
  } catch (error) {
    console.log(error)
    cb?.(socketErrorResponse(error))
  }
}
