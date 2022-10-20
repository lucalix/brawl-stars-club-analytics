export interface IPlayer {
  _id: string
  name: string
  iconUrl: string
  createdAt?: Date
  canceledAt?: Date
  updatedAt?: Date
  clubId?: string
}