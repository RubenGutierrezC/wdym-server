import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode, updateRoom } from '../rooms'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'
import chalk from 'chalk'

export interface SetWinCardProps {
  username: string
  roomCode: string
  card: {
    _id: string
    phrase: string
  }
}

type SetWinCardResponse = SocketResponse<any>

export const setWinCard = async (
  props: SocketMethodProps<SetWinCardProps, SetWinCardResponse>
) => {
  const { data, cb, socket } = props

  try {
    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    const isUserJudge = room.judge.username === data.username

    if (!isUserJudge) {
      return cb?.(socketErrorResponse('You are not the judge'))
    }

    // socket to inform others when username set a card
    socket?.broadcast.to(`room-${data.roomCode}`).emit('winner-card', data.card)

    const winnerParticipant = room.judge?.receivedCards.find(
      (participant: any) => participant._id === data.card._id
    )

    if (!winnerParticipant) {
      return cb?.(socketErrorResponse('A error ocurred when select the winner'))
    }

    const winnerParticipantIndex = room.participants.findIndex(
      (p: any) => p.username === winnerParticipant.username
    )

    if (winnerParticipantIndex === -1) {
      return cb?.(socketErrorResponse('A error ocurred when select the winner'))
    }

    room.participants[winnerParticipantIndex].numberOfWinnings += 1

    const actualJudgeIndex = room.participants.findIndex(
      (p: any) => p.username === room.judge.username
    )

    room.judge = {
      username: room.participants[actualJudgeIndex]?.username,
      receivedCards: []
    }

    const randomMemeIndex = Math.floor(Math.random() * (room.memes.length - 1))

    if (room.gameConfig.actualRound === room.gameConfig.numberOfRounds - 1) {
      console.log(chalk.green.bold('END GAME'))

      // end game
      return cb?.(
        socketOkReponse({
          roomCode: data.roomCode
        })
      )
    }

    room.gameConfig = {
      ...room.gameConfig,
      actualRound: room.gameConfig.actualRound + 1,
      meme: room.memes.splice(randomMemeIndex, 1)[0]
    }

    await updateRoom(data.roomCode, room)

    socket?.in(`room-${data.roomCode}`).emit('next-round')

    return cb?.(
      socketOkReponse({
        roomCode: data.roomCode
      })
    )
  } catch (error) {
    console.log(error)
    cb?.(socketErrorResponse(error))
  }
}
