import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode, updateRoom, findWinnerUser } from '../rooms'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export interface SetWinCardProps {
  username: string
  roomCode: string
  card: {
    _id: string
    phrase: string
  }
}

type SetWinCardResponse = SocketResponse<any>

interface SetWinCardAditionaProps {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

export const setWinCard = async (
  props: SocketMethodProps<
    SetWinCardProps,
    SetWinCardResponse,
    SetWinCardAditionaProps
  >
) => {
  const { data, cb, socket, io } = props

  try {
    // validate if room exist
    const room = await findRoomByCode(data.roomCode)

    if (!room) return cb?.(socketErrorResponse('Room not found'))

    // validate if user is judge
    const isUserJudge = room.judge.username === data.username

    if (!isUserJudge) return cb?.(socketErrorResponse('You are not the judge'))

    // socket to inform others when username set a card
    socket?.broadcast.to(`room-${data.roomCode}`).emit('winner-card', data.card)

    // find winner participant and update number of winnigs
    const winnerParticipant = room.judge?.receivedCards.find(
      (participant: any) => participant._id === data.card._id
    )

    if (!winnerParticipant)
      return cb?.(socketErrorResponse('A error ocurred when select the winner'))

    const winnerParticipantIndex = room.participants.findIndex(
      (p: any) => p.username === winnerParticipant.username
    )

    if (winnerParticipantIndex === -1)
      return cb?.(socketErrorResponse('A error ocurred when select the winner'))

    room.participants[winnerParticipantIndex].numberOfWinnings += 1

    if (room.gameConfig.actualRound === room.gameConfig.numberOfRounds) {
      console.log(chalk.green.bold('END GAME'))

      const winner: any = findWinnerUser(room.participants)

      if (!winner) {
        return cb?.(socketErrorResponse('A error ocurred when find the winner'))
      }

      io.in(`room-${data.roomCode}`).emit('end-game', {
        winner: winner.username
      })

      // end game
      return cb?.(
        socketOkReponse({
          roomCode: data.roomCode
        })
      )
    }

    // set next judge
    const actualJudgeIndex = room.participants.findIndex(
      (p: any) => p.username === room.judge.username
    )

    if (actualJudgeIndex === -1)
      return cb?.(socketErrorResponse('A error ocurred selection new judge'))

    let nextUserIndex =
      actualJudgeIndex + 1 === room.participants.length
        ? 0
        : actualJudgeIndex + 1

    room.judge = {
      username: room.participants[nextUserIndex]?.username,
      receivedCards: []
    }

    // find new meme
    const randomMemeIndex = Math.floor(Math.random() * (room.memes.length - 1))

    room.gameConfig = {
      ...room.gameConfig,
      actualRound: room.gameConfig.actualRound + 1,
      meme: room.memes.splice(randomMemeIndex, 1)[0]
    }

    await updateRoom(data.roomCode, room)

    for (let index in room.participants) {
      if (index !== actualJudgeIndex) {
        const randomCardIndex = Math.floor(
          Math.random() * (room.cards.length - 1)
        )
        const randomCard = room.cards.splice(randomCardIndex, 1)[0]
        room.participants[index].cards.push(randomCard)
        socket
          ?.to(`${room.participants[index].socketId}`)
          .emit('new-card', randomCard)
      }
    }

    io?.in(`room-${data.roomCode}`).emit('next-round', {
      gameConfig: room.gameConfig,
      judge: room.judge
    })

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
