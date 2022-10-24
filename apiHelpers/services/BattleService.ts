import playerModel from '../models/player';
import SupercellService from './SupercellService';
import IPlayer from '../entities/Player';

class BattleService {
  async syncBattles(): Promise<object[]> {
    const players: IPlayer[] = await playerModel.find().sort({ syncedAt: 1 }).limit(5).lean();

    const response: object[] = [];

    for (const player of players) {
      const battles = await SupercellService.getPlayerMatches(player._id);
      console.log(battles.items.length);
      response.push({ player, battles });
    }

    return response;

  }
}

export default new BattleService();