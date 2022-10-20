// import playerRepository from '../repositories/PlayerRepository'
import brawlapiService from './BrawlapiService';
import { IClubMemberFromSupercellApi } from '../dtos';
import playerModel from '../models/player';
import { ICreatePlayerDto } from '../dtos';


class PlayerService {
  async registerClubMembers(data: { members: IClubMemberFromSupercellApi[], clubId: string }): Promise<boolean | undefined> {
    const memberIds = data.members.map(member => {
      return member.tag;
    });

    const membersAlreadyRegistered = await playerModel.find({
      '_id': {
        $in: memberIds
      }
    });

    const membersAlreadyRegisteredIds: string[] = [];

    membersAlreadyRegistered.map(member => {
      membersAlreadyRegisteredIds.push(member.id);
    })

    if (membersAlreadyRegistered.length > 0) {
      await playerModel.updateMany(
        {
          '_id': { $in: membersAlreadyRegisteredIds }
        },
        {
          clubId: data.clubId
        }
      )
    }

    const membersNotRegistered = data.members.filter(member => {
      if (!membersAlreadyRegisteredIds.includes(member.tag)) {
        return member;
      }
    });

    const playerIconList = await brawlapiService.getPlayerIconList();

    const membersFormattedToInsert: ICreatePlayerDto[] = membersNotRegistered.map(member => {
      return {
        _id: member.tag,
        name: member.name,
        clubId: data.clubId,
        iconUrl: playerIconList[member.icon.id].imageUrl
      }
    });

    await playerModel.create(membersFormattedToInsert);

    return true;
  }
}

export default new PlayerService();