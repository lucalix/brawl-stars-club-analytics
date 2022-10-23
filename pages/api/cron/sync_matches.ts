import type { NextApiRequest, NextApiResponse } from 'next'
import MatchService from '../../../apiHelpers/services/MatchService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await MatchService.syncMatches();

    res.json(response);
  } catch (err: any) {
    console.log(err.name, err.message);
    return res.send("failed");
  }
}