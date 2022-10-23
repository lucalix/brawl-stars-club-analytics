import supercellService from './SupercellService';
import brawlapiService from './BrawlapiService';
import playerService from './PlayerService'
import IClub from '../entities/Club';
import IPlayer from '../entities/Player';
import clubModel from '../models/club';
import playerModel from '../models/player';

class ClubService {
  async create(supercellClubId: string) {
    const clubAlreadyExists: IClub | null = await clubModel.findById(supercellClubId);

    if (clubAlreadyExists) {
      throw new Error("Club already exists");
    }

    const clubFromSupercellApi = await supercellService.getClub(supercellClubId);

    if (!clubFromSupercellApi) {
      throw new Error("Club not found at supercell");
    }

    const clubIconUrl: string | undefined = await brawlapiService.getClubIconUrl(clubFromSupercellApi.badgeId);

    const club = await clubModel.create({
      _id: supercellClubId,
      name: clubFromSupercellApi.name,
      iconUrl: clubIconUrl,
      syncedAt: new Date()
    });

    await playerService.registerClubMembers(clubFromSupercellApi);

    return club;
  }

  async find(): Promise<IClub[]> {
    const clubList: IClub[] = await clubModel.find({}).lean();

    if (clubList.length == 0) {
      return [];
    }

    const clubIds: string[] = [];

    clubList.map((club) => {
      clubIds.push(club._id);
    });

    const clubMembers: IPlayer[] = await playerModel.find({
      'clubId': {
        $in: clubIds
      }
    });

    const formattedClubList = clubList.map((club) => {
      const members = clubMembers.filter((member) => {
        return member.clubId === club._id;
      });

      return { ...club, members };
    });

    return formattedClubList;
  }

  async syncClub(): Promise<string> {
    const club: IClub = await clubModel.findOne().sort({ syncedAt: 1 }).lean();
    console.log('Club to sync: ', club);

    const clubFromSupercellApi = await supercellService.getClub(club._id);

    if (!clubFromSupercellApi) {
      return "Club not found";
    }

    const clubIconUrl: string | undefined = await brawlapiService.getClubIconUrl(clubFromSupercellApi.badgeId);

    club.name = clubFromSupercellApi.name;
    club.iconUrl = clubIconUrl ?? club.iconUrl;
    club.syncedAt = new Date();

    console.log('Club synced: ', club);

    await clubModel.updateOne({ '_id': club._id }, club);

    await playerService.syncClubMembers(clubFromSupercellApi);

    return club.name;
  }
}

export default new ClubService();