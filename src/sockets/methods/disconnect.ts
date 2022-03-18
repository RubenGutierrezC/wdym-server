import { SocketMethodProps } from '../../interfaces/globlal'
import { findRoomByCode, updateRoom } from '../rooms'

export const disconnect = async (props: SocketMethodProps) => {
  try {
    const { socket } = props

    let roomCode = ''

    ;(socket as any).adapter.rooms.forEach((value: any, key: any) => {
      if (key.includes('room')) {
        console.log(key)
        roomCode = key.split('-')[1]
        return
      }
    })

    if (!roomCode) {
      // console.log('room code not found on disconnected')
      return
    }

    const room = await findRoomByCode(roomCode)

    if (!room) {
      // console.log('room not found on disconnected')
      return
    }

    const playerDisconnectedIndex = room.participants.findIndex(
      (el: any) => el.socketId === socket?.id
    )

    if (playerDisconnectedIndex === -1) {
      // console.log('player not found on disconnected')
      return
    }

    room.participants[playerDisconnectedIndex].socketId = ''

    await updateRoom(roomCode, room)
  } catch (error) {
    console.log('disconnect error', error)
  }
}
