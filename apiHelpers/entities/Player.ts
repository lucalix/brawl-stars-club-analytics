export default interface IPlayer {
  _id: string
  name: string
  iconUrl: string
  createdAt?: Date
  canceledAt?: Date
  updatedAt?: Date
  syncedAt?: Date
  clubId?: string
}