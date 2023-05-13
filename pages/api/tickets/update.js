import jwt from 'jsonwebtoken';
import { updateTicket, getOrCreateUserByEmail } from '../../../db';

export default async function messages(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Update status
		const helpUser = await getOrCreateUserByEmail(user);
		if (helpUser.admin) {
			const ticket = await updateTicket(user, req.body);
			res.status(200).json({ticket:ticket });
		} else {
			return res.status(401).json({ error: 'Unauthorized' });
		}

	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}