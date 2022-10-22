import brawlapiService from './BrawlapiService';
import { IClubMemberFromSupercellApi, IClubFromSupercellApi } from '../dtos';
import playerModel from '../models/player';
import { ICreatePlayerDto } from '../dtos';
import IPlayer from '../entities/Player';

class PlayerService {
  async registerClubMembers(clubFromSupercellApi: IClubFromSupercellApi): Promise<boolean | undefined> {
    const clubId = clubFromSupercellApi.tag;

    const freshClubMembersIds = this.getFreshClubMembersIds(clubFromSupercellApi.members);

    const membersAlreadyRegistered: IPlayer[] = await playerModel.find({
      '_id': {
        $in: freshClubMembersIds
      }
    });

    const membersAlreadyRegisteredIds = this.getCurrentClubMembersIds(membersAlreadyRegistered);

    if (membersAlreadyRegistered.length > 0) {
      await playerModel.updateMany(
        {
          '_id': { $in: membersAlreadyRegisteredIds }
        },
        {
          clubId: clubId
        }
      )
    }

    const membersNotRegistered = await this.getNotRegisteredMembers(clubFromSupercellApi.members, membersAlreadyRegisteredIds, clubId);

    await playerModel.create(membersNotRegistered);

    return true;
  }

  async syncClubMembers(clubFromSupercellApi: IClubFromSupercellApi) {
    const clubId = clubFromSupercellApi.tag;
    const freshClubMembers = clubFromSupercellApi.members;

    const freshClubMembersIds = this.getFreshClubMembersIds(freshClubMembers);

    await this.syncMembersWhoWereAlreadyRegisteredButInAnotherClub(freshClubMembersIds, clubId);

    const currentClubMembers: IPlayer[] = await playerModel.find({
      clubId
    }).lean();

    const currentClubMembersIds = this.getCurrentClubMembersIds(currentClubMembers);

    await this.removeMembersWhoLeftTheClub(freshClubMembersIds, clubId);

    await this.syncMembersWhoRemainedInClub(freshClubMembers, clubId);

    const membersNotRegistered = await this.getNotRegisteredMembers(freshClubMembers, currentClubMembersIds, clubId);

    await playerModel.create(membersNotRegistered);
  }

  async removeMembersWhoLeftTheClub(freshClubMembersIds: string[], clubId: string) {
    await playerModel.updateMany({ clubId, '_id': { $nin: freshClubMembersIds } }, { 'clubId': null });
  }

  async getNotRegisteredMembers(freshClubMembers: IClubMemberFromSupercellApi[], currentClubMembersIds: string[], clubId: string): Promise<ICreatePlayerDto[]> {
    const membersNotRegistered = freshClubMembers.filter(member => {
      if (!currentClubMembersIds.includes(member.tag)) {
        return member;
      }
    });

    const membersNotRegisteredFormatted = await this.formatMembersToInsert(membersNotRegistered, clubId);

    return membersNotRegisteredFormatted;
  }

  async formatMembersToInsert(rawMembers: IClubMemberFromSupercellApi[], clubId: string): Promise<ICreatePlayerDto[]> {
    const playerIconList = await brawlapiService.getPlayerIconList();

    const membersFormattedToInsert: ICreatePlayerDto[] = rawMembers.map(member => {
      return {
        _id: member.tag,
        name: member.name,
        clubId,
        iconUrl: playerIconList[member.icon.id].imageUrl
      }
    });

    return membersFormattedToInsert;
  }

  getCurrentClubMembersIds(members: IPlayer[]): string[] {
    const ids = members.map(member => {
      return member._id;
    });

    return ids;
  }

  getFreshClubMembersIds(members: IClubMemberFromSupercellApi[]): string[] {
    const ids = members.map(member => {
      return member.tag;
    });

    return ids;
  }

  async syncMembersWhoWereAlreadyRegisteredButInAnotherClub(freshClubMembersIds: string[], clubId: string) {
    const members: IPlayer[] = await playerModel.find({
      '_id': {
        $in: freshClubMembersIds
      },
      'clubId': { $ne: clubId }
    });

    const membersIds = this.getCurrentClubMembersIds(members);

    if (membersIds.length > 0) {
      await playerModel.updateMany(
        {
          '_id': { $in: membersIds }
        },
        {
          clubId
        }
      )
    }
  }

  async syncMembersWhoRemainedInClub(freshClubMembers: IClubMemberFromSupercellApi[], clubId: string) {
    const playerIconList = await brawlapiService.getPlayerIconList();

    const currentClubMembers: IPlayer[] = await playerModel.find({
      clubId
    }).lean();

    const membersUpdatePromises = currentClubMembers.map(currentMember => {
      const freshMember = freshClubMembers.find(member => member.tag === currentMember._id);

      const _id = currentMember._id;
      const iconUrl = freshMember ? playerIconList[freshMember.icon.id].imageUrl : currentMember.iconUrl;
      const name = freshMember ? freshMember.name : currentMember.name;

      return playerModel.updateOne({ _id }, { name, iconUrl });
    });

    await Promise.all(membersUpdatePromises);
  }
}

export default new PlayerService();