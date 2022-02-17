import {
  SocketResponse,
  socketErrorResponse,
  socketOkReponse
} from '../socketHelpers'
import { SocketMethodProps } from '../../interfaces/globlal'
import { rooms as inMemoryRooms, findRoomByCode } from '../rooms'

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

export const getParticipantsInRoom = async (
  props: SocketMethodProps<
    getParticipantsInRoomProps,
    getParticipantsInRoomResponse
  >
) => {
  const { data, cb } = props
  try {
    const room = await findRoomByCode(data.code)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    cb?.(
      socketOkReponse({
        participants: room.participants
      })
    )
  } catch (error) {
    cb?.(socketErrorResponse(error))
  }
}
