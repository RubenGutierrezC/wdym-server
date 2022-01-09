import { SocketMethodProps } from '../../interfaces/globlal'
import { nanoid } from 'nanoid'
import roomRepository from '../../components/rooms/roomRepository'
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

    const r = await roomRepository.createRoom({
      username: data.username,
      code: roomCode
    })

    // await roomRepository.createRoom({
    //   username,
    //   code: roomCode
    // })

    // socket?.join(`room-${roomCode}`)

    // rooms[roomCode] = {
    //   participants: [
    //     {
    //       username,
    //       isRoomCreator: true,
    //       numberOfWinnings: 0,
    //       socketId: socket.id
    //     }
    //   ]
    // }

    cb && cb(socketOkReponse({ roomCode }))
  } catch (error) {
    cb && cb(socketErrorResponse(error))
  }
}
