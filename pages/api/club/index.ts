import type { NextApiRequest, NextApiResponse } from 'next'
import { validateCreateClubRequest } from '../../../apiHelpers/validators/createClubRequestValidator'
import ClubService from '../../../apiHelpers/services/ClubService';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return list(req, res);
    case 'POST':
      return create(req, res);
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function list(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const clubList = await ClubService.find();

    res.status(200).json(clubList);
  } catch (err: any) {
    console.log(err.name, err.message);
    return res.json({ error: err.name, message: err.message });
  }
}

async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await validateCreateClubRequest(req, res);

    const supercellClubId = req.body.supercellClubId;

    const createClub = await ClubService.create(supercellClubId);

    res.status(201).json({ id: createClub });
  } catch (err: any) {
    console.log(err.name, err.message);
    return res.json({ error: err.name, message: err.message });
  }
}