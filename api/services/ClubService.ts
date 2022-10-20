import supercellService from './SupercellService';
import brawlapiService from './BrawlapiService';
import playerService from './PlayerService'
// import IClub from '../entities/Club';
// import { Player } from '../entities/Player';
import clubModel from '../models/club';

class ClubService {
  async create(supercellClubId: string) {
    const clubAlreadyExists = await clubModel.findById(supercellClubId);

    console.log('club found: ', clubAlreadyExists);

    if (clubAlreadyExists) {
      throw new Error("Club already exists");
    }

    console.log('Throw 1');

    const clubFromSupercellApi = await supercellService.getClub(supercellClubId);

    if (!clubFromSupercellApi) {
      throw new Error("Club not found at supercell");
    }

    const clubIconUrl: string | undefined = await brawlapiService.getClubIconUrl(clubFromSupercellApi.badgeId);

    console.log('aqqq');

    const club = await clubModel.create({
      _id: supercellClubId,
      name: clubFromSupercellApi.name,
      iconUrl: clubIconUrl
    });

    await playerService.registerClubMembers({
      members: clubFromSupercellApi.members,
      clubId: supercellClubId
    });

    return club;
  }

  // async find(): Promise<IClub[]> {
  //   const clubList = await clubRepository.find();

  //   if (clubList.length == 0) {
  //     return [];
  //   }

  //   const clubIds: string[] = [];

  //   clubList.map((club) => {
  //     clubIds.push(club.id);
  //   });

  //   const clubMembers: Player[] = await playerRepository.find(clubIds);

  //   const formattedClubList = clubList.map((club) => {
  //     const members = clubMembers.filter((member) => {
  //       return member.club_id === club.id;
  //     });

  //     return { ...club, members };
  //   });

  //   return formattedClubList;
  // }
}

export default new ClubService();