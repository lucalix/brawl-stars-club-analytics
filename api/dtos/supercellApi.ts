export interface IClubFromSupercellApi {
  tag: string
  name: string
  description: string
  type: string
  badgeId: number
  requiredTrophies: number
  trophies: number
  members: IClubMemberFromSupercellApi[]
}

export interface IClubMemberFromSupercellApi {
  tag: string
  name: string
  nameColor: string
  role: string
  trophies: number
  icon: {
    id: number
  }
}