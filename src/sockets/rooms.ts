export const rooms: { [key: string]: any } = {}

// TODO: change interface name
interface GenerateRoomProps {
  username: string
  roomCode: string
  socketId: string
}

export const generateRoom = ({
  username,
  roomCode,
  socketId
}: GenerateRoomProps): void => {
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

export const addParticipantToRoom = ({
  username,
  roomCode,
  socketId
}: GenerateRoomProps): void => {
  rooms[roomCode].participants.push({
    username,
    isRoomCreator: false,
    numberOfWinnings: 0,
    socketId: socketId
  })

  console.log('room join', rooms)
}
