import { redisClient } from '../services/redis'
import phraseRepository from '../components/phrases/phraseRepository'
import memeRepository from '../components/memes/memeRepository'
export const rooms: { [key: string]: any } = {}

// TODO: change interface name
interface GenerateRoomProps {
  username: string
  roomCode: string
  socketId: string
}

export const generateRoom = async ({
  username,
  roomCode,
  socketId
}: GenerateRoomProps): Promise<void> => {
  await redisClient.json.set(`room-${roomCode}`, '.', {
    participants: [
      {
        username,
        isRoomCreator: true,
        numberOfWinnings: 0,
        socketId: socketId
      }
    ]
  })
}

export const addParticipantToRoom = async ({
  username,
  roomCode,
  socketId
}: GenerateRoomProps): Promise<void> => {
  await redisClient.json.arrAppend(`room-${roomCode}`, '.participants', {
    username,
    isRoomCreator: false,
    numberOfWinnings: 0,
    socketId: socketId
  })
}

export const findRoomByCode = async (roomCode: string): Promise<any | null> => {
  return redisClient.json.get(`room-${roomCode}`)
}

export const updateRoom = async (roomCode: string, room: any) => {
  await redisClient.json.set(`room-${roomCode}`, '.', room)
}

export const findWinnerUser = (participants: any[] = []) => {
  const maxWins = Math.max(...participants.map((el) => el.numberOfWinnings))
  const index = participants.findIndex((el) => el.numberOfWinnings === maxWins)
  return participants[index]
}

export const getCardsAndMemes = async () => {
  const [phrases, memes] = await Promise.allSettled([
    phraseRepository.findApprovedPhrases(),
    memeRepository.findApprovedMemes()
  ])

  return {
    phrases: phrases.status === 'fulfilled' ? phrases.value : [],
    memes: memes.status === 'fulfilled' ? memes.value : []
  }
}
