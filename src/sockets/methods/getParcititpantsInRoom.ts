import {
  SocketResponse,
  socketErrorResponse,
  socketOkReponse
} from '../socketHelpers'
import { SocketMethodProps } from '../../interfaces/globlal'
import { rooms as inMemoryRooms } from '../rooms'

interface getParticipantsInRoomProps {
  code: string
  username: string
}

type getParticipantsInRoomResponse = SocketResponse<{
  participants: {
    username: string
    isRoomCreator: boolean
  }[]
} | null>

interface getParticipantsInRoomAditionaProps {
  rooms: Map<string, Set<string>> | undefined
}

export const getParticipantsInRoom = async (
  props: SocketMethodProps<
    getParticipantsInRoomProps,
    getParticipantsInRoomResponse,
    getParticipantsInRoomAditionaProps
  >
) => {
  const { data, cb, socket, rooms } = props
  try {
    if (rooms?.size === 0 || !rooms?.has(`room-${data.code}`)) {
      return cb && cb(socketErrorResponse('Room not found'))
    }

    const room = inMemoryRooms[data.code]

    console.log('get-p', room)

    cb &&
      cb(
        socketOkReponse({
          participants: room.participants
        })
      )
  } catch (error) {
    cb && cb(socketErrorResponse(error))
  }
}
