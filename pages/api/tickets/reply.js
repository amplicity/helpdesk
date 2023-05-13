import jwt from 'jsonwebtoken';
import { sendMessage } from '../../../db';

export default async function reply(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Get messages
		const message = await sendMessage(user, req.body);

		res.status(200).json({message:message });
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}