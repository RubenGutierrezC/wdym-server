import { roomModel } from './roomModel';
import { CreateRoomRepositoryProps } from './rooms-interface';

const createRoom = async (props: CreateRoomRepositoryProps)  => {

  const { code, username } = props

  const data = new roomModel({
    code,
    participants: [{
      username,
      isRoomCreator: true
    }]
  })

  return data.save()
}

const roomRepository = {
  createRoom
}
export default roomRepository