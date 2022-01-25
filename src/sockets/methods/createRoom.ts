import { SocketMethodProps } from '../../interfaces/globlal'
import { nanoid } from 'nanoid'
import { generateRoom } from '../rooms'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'

export interface CreateRoomProps {
  username: string
}

type CreateRoomResponse = SocketResponse<{
  roomCode: string
} | null>

interface AditionalProps {
  socketRooms?: Map<string, Set<string>>
}

export const createRoom = async (
  props: SocketMethodProps<CreateRoomProps, CreateRoomResponse, AditionalProps>
) => {
  const { data, cb, socket } = props

  try {
    const roomCode = await nanoid(6)

    socket?.join(`room-${roomCode}`)

    await generateRoom({
      username: data.username,
      roomCode,
      socketId: socket?.id || ''
    })

    cb && cb(socketOkReponse({ roomCode }))
  } catch (error) {
    cb && cb(socketErrorResponse(error))
  }
}
