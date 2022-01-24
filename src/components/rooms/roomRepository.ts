import { roomModel } from './roomModel'
import { CreateRoomRepositoryProps } from './rooms-interface'

const createRoom = async (props: CreateRoomRepositoryProps) => {
  const { code, username } = props

  const data = new roomModel({
    code,
    participants: [
      {
        username,
        isRoomCreator: true
      }
    ]
  })

  return data.save()
}

const findOneRoom = async (code: string) => {
  const data = await roomModel.findOne({ code })

  return data
}

const roomRepository = {
  createRoom,
  findOneRoom
}
export default roomRepository
