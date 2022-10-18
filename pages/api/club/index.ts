import type { NextApiRequest, NextApiResponse } from 'next'

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

function create(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supercell_club_id = req.body.supercell_club_id;

	res.status(201).json({ ok: `Club ${supercell_club_id} created` });
}