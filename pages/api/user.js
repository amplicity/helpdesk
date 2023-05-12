import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../../modules/Cookie';
import { getOrCreateUserByEmail } from '../../db';

export default async function user(req, res) {
  try {
    if (!req.cookies.token) return res.json({ user: null });

    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);

    // Refresh JWT
    let newToken = jwt.sign(
      {
        ...user,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS,
      },
      process.env.JWT_SECRET,
    );

    setTokenCookie(res, newToken);
    let helpUser = await getOrCreateUserByEmail(user);

    res.status(200).json({ user:user , helpUser: helpUser });
  } catch (error) {
    console.error('error', error);
    res.status(200).json({ user: null });
  }
}