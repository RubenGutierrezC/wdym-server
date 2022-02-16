import { redisClient } from '../services/redis'
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
