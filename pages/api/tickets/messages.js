import jwt from 'jsonwebtoken';
import { getTicket } from '../../../db';

export default async function messages(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Post reply
		const ticket = await getTicket(user, req.body);
		if (ticket){
			res.status(200).json({ticket:ticket });
		} else {
			return res.status(401).json({ error: 'Unauthorized' });
		}
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}