import jwt from 'jsonwebtoken';
import { createTicket, createMessage } from '../../../db';

export default async function create(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Create ticket
		const createdTicket = await createTicket(user, req.body);
		console.log('createdTicket', createdTicket);

		// Create first message
		const createdMessage = await createMessage(user, createdTicket.id, req.body);

		// Return updated user data
		res.status(200).json({ createdMessage });
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}