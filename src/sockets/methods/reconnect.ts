import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode, updateRoom } from '../rooms'
import {
  socketErrorResponse,
  SocketResponse,
  socketOkReponse
} from '../socketHelpers'

interface ReconnectProps {
  roomCode: string
  username: string
}

type ReconnectResponse = SocketResponse<{
  roomCode: string
} | null>

export const reconnect = async (
  props: SocketMethodProps<ReconnectProps, ReconnectResponse>
) => {
  try {
    const { data, socket, cb } = props

    console.log('reconnect', data)

    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      console.log('room not found')
      return cb?.(socketErrorResponse('Room not found'))
    }

    const participantIndex = room.participants.findIndex(
      (el: any) => el.username === data?.username
    )

    if (participantIndex === -1) {
      console.log('user not found')
      return cb?.(socketErrorResponse('User not found'))
    }

    room.participants[participantIndex].socketId = socket?.id || ''

    console.log(participantIndex, socket)

    console.log('room', room)

    await updateRoom(data.roomCode, room)

    return cb?.(
      socketOkReponse({
        roomCode: data.roomCode
      })
    )
  } catch (error) {
    console.log('error on reconnect')
  }
}
