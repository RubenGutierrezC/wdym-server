import {
  SocketResponse,
  socketErrorResponse,
  socketOkReponse
} from '../socketHelpers'
import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode } from '../rooms'

interface getRoomInfoProps {
  roomCode: string
  username: string
}

type getRoomInfoResponse = SocketResponse<any>

export const getRoomInfo = async (
  props: SocketMethodProps<getRoomInfoProps, getRoomInfoResponse>
) => {
  const { data, cb } = props

  try {
    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    const participantCards = room.participants.find(
      (participant: any) => participant.username === data.username
    )

    const participants = room.participants.map((participant: any) => ({
      username: participant.username,
      isRoomCreator: participant.isRoomCreator,
      numberOfWinnings: participant.numberOfWinnings
    }))

    const judge = room.judge

    const gameConfig = room.gameConfig

    cb?.(
      socketOkReponse({
        participantCards,
        participants,
        judge,
        gameConfig
      })
    )
  } catch (error) {
    cb?.(socketErrorResponse(error))
  }
}
