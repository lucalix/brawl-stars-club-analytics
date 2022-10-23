import playerModel from '../models/player';
import SupercellService from './SupercellService';
import IPlayer from '../entities/Player';

class MatchService {
  async syncMatches(): Promise<object[]> {
    const players: IPlayer[] = await playerModel.find().sort({ syncedAt: 1 }).limit(5).lean();

    const response: object[] = [];

    for (const player of players) {
      const matches = await SupercellService.getPlayerMatches(player._id);
      console.log(matches.items.length);
      response.push({ player, matches });
    }

    return response;

  }
}

export default new MatchService();