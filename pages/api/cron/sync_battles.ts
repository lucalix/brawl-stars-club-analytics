import type { NextApiRequest, NextApiResponse } from 'next'
import BattleService from '../../../apiHelpers/services/BattleService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await BattleService.syncBattles();

    res.json(response);
  } catch (err: any) {
    console.log(err.name, err.message);
    return res.send("failed");
  }
}