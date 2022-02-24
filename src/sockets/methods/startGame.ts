import { SocketMethodProps } from '../../interfaces/globlal'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'

import { Participants } from '../../components/rooms/rooms-interface'
import { initialize, memes, phrases } from '..'
import { findRoomByCode } from '../rooms'
import { redisClient } from '../../services/redis'

interface StartGameProps {
  roomCode: string
  username: string
}

type StartGameResponse = SocketResponse<{
  roomCode: string
} | null>

export const startGame = async (
  props: SocketMethodProps<StartGameProps, StartGameResponse>
) => {
  const { data, cb, socket } = props

  try {
    const room = await findRoomByCode(data.roomCode)

    if (!room) {
      return cb?.(socketErrorResponse('Room not found'))
    }

    const master = room.participants.find(
      (p: Participants) => p.username === data.username
    )

    if (!master?.isRoomCreator) {
      return cb?.(socketErrorResponse('User not found or not the creator'))
    }

    //inicializa los arreglos con datos extraidos de la DB
    await initialize()
    // let participantCards: Array<PhraseModel> = []
    let participants = room.participants

    for (let index in participants) {
      let participantCards: any[] = []
      for (let _i = 0; _i < 7; _i++) {
        const random = Math.floor(Math.random() * (phrases.length - 1))
        participantCards.push(phrases.splice(random, 1)[0])
      }
      room.participants[index].cards = participantCards
    }

    room['cards'] = phrases
    room['memes'] = memes

    const randomInitNumber = Math.floor(
      Math.random() * room.participants.length
    )

    room['judge'] = {
      username: room.participants[randomInitNumber].username,
      receivedCards: []
    }

    const randomMemeIndex = Math.floor(Math.random() * (memes.length - 1))

    room['gameConfig'] = {
      numberOfRounds: 5,
      actualRound: 1,
      meme: memes.splice(randomMemeIndex, 1)[0]
    }

    await redisClient.json.set(`room-${data.roomCode}`, '.', room)

    socket?.to(`room-${data.roomCode}`).emit('start-game')

    return cb?.(socketOkReponse({ roomCode: data.roomCode }))
  } catch (error) {
    cb?.(socketErrorResponse(error))
  }
}
