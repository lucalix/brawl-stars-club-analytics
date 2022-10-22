import type { NextApiRequest, NextApiResponse } from 'next'
import ClubService from '../../../apiHelpers/services/ClubService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await ClubService.syncClub();

    res.send("success");
  } catch (err: any) {
    console.log(err.name, err.message);
    return res.send("failed");
  }
}