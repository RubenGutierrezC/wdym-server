import { SocketMethodProps } from '../../interfaces/globlal';
import { nanoid } from 'nanoid';
import roomRepository from '../../components/rooms/roomRepository';

export interface CreateRoomProps {
  username: string
}

interface CreateRoomResponse {
  roomCode: string
}

interface AditionalProps {
  socketRooms?: Map<string, Set<string>>
}

export const createRoom = async (props: SocketMethodProps<CreateRoomProps, CreateRoomResponse, AditionalProps>)=> {
  const { data, cb, socket } = props

  try {

        const roomCode = await nanoid(6)


        const r = await roomRepository.createRoom({username: data.username, code: roomCode })

        // await roomRepository.createRoom({
        //   username,
        //   code: roomCode
        // })

        // socket?.join(`room-${roomCode}`)

        // rooms[roomCode] = {
        //   participants: [
        //     {
        //       username,
        //       isRoomCreator: true,
        //       numberOfWinnings: 0,
        //       socketId: socket.id
        //     }
        //   ]
        // }


        cb && cb({
          roomCode,
          // participants: rooms[roomCode].participants || []
        })

  } catch (error) {
    console.log(error)
  }

}