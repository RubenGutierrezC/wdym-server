import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode } from '../rooms'
import { redisClient } from '../../services/redis'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'

export interface SetCardProps {
  username: string
  roomCode: string
  card: {
    _id: string
    phrase: string
  }
}

type SetCardResponse = SocketResponse<any>

export const setCard = async (
  props: SocketMethodProps<SetCardProps, SetCardResponse>
) => {
  const { data, cb, socket } = props

  try {
    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    const isUserJudge = room.judge.username === data.username

    if (isUserJudge) {
      return cb?.(socketErrorResponse('You are the judge'))
    }

    const isUserAlreadyPlay = room.judge.receivedCards.some(
      (player: any) => player.username === data.username
    )

    if (isUserAlreadyPlay) {
      return cb?.(socketErrorResponse('You already play a card'))
    }

    // socket to inform others when username set a card
    socket?.broadcast
      .to(`room-${data.roomCode}`)
      .emit('participant-set-card', data.username)

    room.judge.receivedCards.push({
      username: data.username,
      ...data.card
    })

    const isRoundOver =
      room.judge.receivedCards.length === room.participants.length - 1

    console.log(
      isRoundOver,
      room.judge.receivedCards.length,
      room.participants.length - 1
    )

    if (isRoundOver) {
      // send socket to all partcipants, the judge have to take the winner
      socket
        ?.to(`room-${data.roomCode}`)
        .emit('select-card', room.judge?.receivedCards)
    }

    await redisClient.json.set(`room-${data.roomCode}`, '.', room as any)

    return cb?.(
      socketOkReponse({
        roomCode: data.roomCode
      })
    )
  } catch (error) {
    cb?.(socketErrorResponse(error))
  }
}
