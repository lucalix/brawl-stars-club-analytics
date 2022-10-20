import type { NextApiRequest, NextApiResponse } from 'next'
import { validateCreateClubRequest } from '../../../api/validators/createClubRequestValidator'
import ClubService from '../../../api/services/ClubService';

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

function list(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json({ id: "01", name: "strangers" });
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

	}
}