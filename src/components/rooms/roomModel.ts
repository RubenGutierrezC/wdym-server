import mongoose from 'mongoose'
import { RoomModel } from './rooms-interface';
const { model, Schema } = mongoose


const RoomSchema = new Schema<RoomModel>({
  code: {
    type: String,
    required: true
  },
  totalRounds: {
    type: Number,
    required: true,
    default: 10
  },
  mathematicalWinCondition: {
    type: Number,
    required: true,
    default: 6
  },
  participants: [{
    username: String,
    isRoomCreator: {
      type: Boolean,
      default: false,
    },
    numberOfWinnings: {
      type: Number,
      default: 0
    }
  }],
  winningPariticipant: {
    type: String,
  },
  rounds: [{
    number: {
      type: Number,
      default: 1
    },
    mainCard: String,
    winingUser: String,
    /**
     * cards selected for users
     */
    cards: [{
      username: String,
      card: String
    }]
  }]
})

export const roomModel = model<RoomModel>('Room', RoomSchema)