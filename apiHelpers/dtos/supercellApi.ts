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

export interface IBattleFromSupercellApi {
  items: IBattleItemFromSupercellApi[]
}

export interface IBattleItemFromSupercellApi {
  battleTime: string
  event: {
    id: number
    mode: string
    map: string
  }
  battle: {
    mode: string
    type: string
    result: "victory" | "defeat" | "draw"
    duration: number
    trophyChange: number
    starPlayer: IBattlePlayerFromSupercellApi,
    teams: IBattlePlayerFromSupercellApi[][]
  }
}

export interface IBattlePlayerFromSupercellApi {
  tag: string
  name: string
  brawler: {
    id: number
    name: string
    power: number
    trophies: number
  }
}