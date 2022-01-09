//Model interface 
interface Participants {
  username: string
  isRoomCreator: boolean
  numberOfWinnings: number
}

interface Round {
  number: number;
  mainCard: string;
  winingUser: string;
  cards: {username: string; card: string}[]
}

export interface RoomModel {
  code: string;
  totalRounds: number;
  mathematicalWinCondition: number;
  participants: Participants[]
  winningPariticipant: string
  rounds: Round[]
}

// Repositories
export interface CreateRoomRepositoryProps {
  code: string,
  username: string
}