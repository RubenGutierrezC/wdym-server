import { Server } from 'socket.io'
import { SocketMethodProps } from '../../interfaces/globlal'
import {
  SocketResponse,
  socketOkReponse,
  socketErrorResponse
} from '../socketHelpers'
import { PhraseModel } from '../../components/phrases/phrase-interface'
import roomRepository from '../../components/rooms/roomRepository'
import { Participants } from '../../components/rooms/rooms-interface'
import { initialize, memes, phrases } from '..'

interface StartGameProps {
  code: string
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
    const room = await roomRepository.findOneRoom(data.code)
    if (room) {
      const master = room.participants.find(
        (p: Participants) => p.username === data.username
      )

      if (master?.isRoomCreator == true) {
        //inicializa los arreglos con datos extraidos de la DB
        await initialize()
        let participantCards: Array<PhraseModel> = []
        let participants: Array<Participants> = room.participants
        //saca al creador de la sala del arreglo
        participants.splice(participants.indexOf(master), 1)
        //le envia el meme al creador de la sala
        socket?.to(master.username).emit('deal-meme', { meme: memes.shift() })

        //reparte 7 cartas a cada participante de la sala de forma aleatoria
        for (let p of room.participants) {
          for (let _i = 0; _i < 7; _i++) {
            const random = Math.floor(Math.random() * (phrases.length - 1))

            console.log(phrases.splice(random, 1))

            participantCards.push(phrases.splice(random, 1)[0])
          }
          console.log(participantCards)

          socket?.to(p.username).emit('deal-cards', { cards: participantCards })
        }

        cb && cb(socketOkReponse({ roomCode: data.code }))
      } else {
        return (
          cb && cb(socketErrorResponse('User not found or not the creator'))
        )
      }
    } else {
      return cb && cb(socketErrorResponse('Room not found'))
    }
  } catch (error) {
    cb && cb(socketErrorResponse(error))
  }
}
