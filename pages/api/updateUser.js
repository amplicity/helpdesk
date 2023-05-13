import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../../modules/Cookie';
import { updateUser } from '../../db';

export default async function update(req, res) {
	try {
		if (!req.cookies.token) return res.status(401).json({ error: 'Unauthorized' });

		// Verify user is authenticated
		let token = req.cookies.token;
		let user = jwt.verify(token, process.env.JWT_SECRET);

		// Update user's information
		const updatedData = req.body;
		const updatedUser = await updateUser(user, updatedData);

		// Return updated user data
		res.status(200).json({ updatedUser });
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}