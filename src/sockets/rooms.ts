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

  rooms[roomCode] = {
    participants: [
      {
        username,
        isRoomCreator: true,
        numberOfWinnings: 0,
        socketId: socketId
      }
    ]
  }

  console.log('room generated', rooms)
}

export const addParticipantToRoom = async ({
  username,
  roomCode,
  socketId
}: GenerateRoomProps): Promise<void> => {
  await redisClient.json.arrAppend(`room-${roomCode}`, '.participants', {
    username,
    isRoomCreator: true,
    numberOfWinnings: 0,
    socketId: socketId
  })

  rooms[roomCode].participants.push({
    username,
    isRoomCreator: false,
    numberOfWinnings: 0,
    socketId: socketId
  })

  console.log('room join', rooms)
}
