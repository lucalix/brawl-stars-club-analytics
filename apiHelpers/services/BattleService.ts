import playerModel from '../models/player';
import SupercellService from './SupercellService';
import IPlayer from '../entities/Player';
import { IBattleFromSupercellApi, IBattleItemFromSupercellApi } from '../dtos/supercellApi';
import battleModel from '../models/battle';
import { v4 as uuid } from 'uuid';

class BattleService {
  async syncBattles() {
    const players: IPlayer[] = await playerModel.find({ clubId: { $ne: null } }).sort({ battlesSyncedAt: 1 }).limit(15).lean();

    for (const player of players) {
      const lastBattles: IBattleFromSupercellApi = await SupercellService.getPlayerMatches(player._id);

      const battles = this.filterClubLeagueAndPowerLeagueBattles(lastBattles.items);
      const battleIds = battles.map(battle => battle.battleTime);

      const alreadyRegisteredBattles = await battleModel.find({ "_id": { $in: battleIds } }).lean();
      const alreadyRegisteredBattlesIds = alreadyRegisteredBattles.map(battle => battle._id);

      const notRegisteredBattles = battles.filter(battle => !alreadyRegisteredBattlesIds.includes(battle.battleTime));

      const battleGroups = this.discoverAndSetBattleGroups(notRegisteredBattles);

      const battleGroupsFormatted = this.discoverAndSetRankedMode(battleGroups);

      if (battleGroupsFormatted.length > 0) {
        await this.createBattles(battleGroupsFormatted);
      }
      await playerModel.updateOne({ _id: player._id }, { battlesSyncedAt: new Date() });
      console.log('Player: ', player.name, player._id);
      console.log('Batalhas registradas: ', notRegisteredBattles.length);
      console.log('Groupos de batalhas registrados: ', battleGroupsFormatted.length);
      console.log('----');
    }

    console.log('FINALIZOU');
    console.log('----');

    return true;
  }

  filterClubLeagueAndPowerLeagueBattles(battles: IBattleItemFromSupercellApi[]) {
    const wantedEventTypes = ["teamRanked", "soloRanked"]

    return battles.filter(battle => wantedEventTypes.includes(battle.battle.type));
  }

  discoverAndSetBattleGroups(battles: IBattleItemFromSupercellApi[]) {
    let groups: any[] = [];

    let notGroupedBattles = [...battles];

    while (notGroupedBattles.length > 0) {
      let battleInFirstPosition = notGroupedBattles[0];
      let battleGroup = [battleInFirstPosition];
      let sameGroupBattles: any[] = [];

      notGroupedBattles.splice(0, 1);

      sameGroupBattles = notGroupedBattles.filter(battle => {
        if (
          JSON.stringify(battle.event) === JSON.stringify(battleInFirstPosition.event) &&
          battle.battle.type === battleInFirstPosition.battle.type &&
          JSON.stringify(battle.battle.teams) === JSON.stringify(battleInFirstPosition.battle.teams)
        ) {
          return true;
        }

        return false;
      });

      battleGroup = battleGroup.concat(sameGroupBattles);

      let processedBattleIds: string[] = battleGroup.map(battle => battle.battleTime);

      let battleGroupId = uuid();
      let formattedBattleGroup: any = battleGroup.map(battle => {
        let formattedBattle = { ...battle, groupId: battleGroupId }

        if (battle.battle.starPlayer) {
          return { ...formattedBattle, isMainBattle: true };
        }

        return { ...formattedBattle, isMainBattle: false };
      });

      groups.push(formattedBattleGroup);

      notGroupedBattles = notGroupedBattles.filter(battle => !processedBattleIds.includes(battle.battleTime));
    }

    return groups;
  }

  async createBattles(battleGroups: any[]) {

    const createBattlesPromises: any[] = [];

    for (const group of battleGroups) {
      for (const battle of group) {
        let createBattleObject: any = {
          _id: battle.battleTime,
          groupId: battle.groupId,
          isClubLeague: battle.isClubLeague,
          isPowerLeague: battle.isPowerLeague,
          isMainBattle: battle.isMainBattle,
          event: battle.event,
          battle: {
            ...battle.battle,
            starPlayer: battle.battle.starPlayer?.tag
              ?
              {
                tag: battle.battle.starPlayer.tag
              }
              :
              null,
            teams: {
              teamOne: [...battle.battle.teams[0]],
              teamTwo: [...battle.battle.teams[1]]
            }
          }
        }

        let createBattlePromise = battleModel.create(createBattleObject)
        createBattlesPromises.push(createBattlePromise);
      }
    }

    await Promise.all(createBattlesPromises);
  }

  discoverAndSetRankedMode(battleGroups: any[]) {
    const processedBattleGroups = battleGroups.map(group => {
      const mainBattle = group.find((battle: { isMainBattle: boolean; }) => battle.isMainBattle);

      const isPowerLeague: boolean = mainBattle?.battle?.trophyChange ? false : true;
      const isClubLeague: boolean = mainBattle?.battle?.trophyChange ? true : false;

      const groupBattles = group.map((battle: any) => {
        return {
          ...battle,
          isClubLeague,
          isPowerLeague
        }
      });

      return groupBattles;
    })

    return processedBattleGroups;
  }
}

export default new BattleService();

