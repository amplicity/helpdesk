import jwt from 'jsonwebtoken';
import { getTicket } from '../../../db';

export default async function create(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Get messages
		const ticket = await getTicket(user, req.body);

		res.status(200).json({ticket:ticket });
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}