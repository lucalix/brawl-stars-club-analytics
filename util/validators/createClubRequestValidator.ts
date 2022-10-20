import * as Yup from "yup";

import { NextApiRequest, NextApiResponse } from 'next';

const schema = Yup.object().shape({
	supercellClubId: Yup.string().required()
});

export const validateCreateClubRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await schema.validate(req.body);
	} catch (err: any) {
		return res.status(400).json({ type: err.name, message: err.message });
	}
};