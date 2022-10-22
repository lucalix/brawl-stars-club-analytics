import IPlayer from './Player';

export default interface IClub {
  _id: string
  name: string
  iconUrl: string
  groupId: string
  canceledAt?: Date
  createdAt?: Date
  updatedAt?: Date
  syncedAt?: Date
  members?: IPlayer[]
}