import { magic } from '../../modules/MagicAdmin';
import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../../modules/Cookie';
import { getOrCreateUserByEmail } from '../../db';

/**
 * Use Magic to validate the DID token sent in the Autorization header
 * Create JWT containing info about the user
 * Set it inside a cookie, which will be automatically sent on subsequent requests to our server
 * Return the user data to frontend
 * @param {object} req // isAdmin: bool, name: string
 * @param {object} res
 * @returns {object} { user: { name, email, issuer }, helpUser: { name, email, isAdmin } }
 */
export default async function login(req, res) {
  try {
    const didToken = req.headers.authorization.substr(7);

    await magic.token.validate(didToken);

    const user = await magic.users.getMetadataByToken(didToken);

    let token = jwt.sign(
      {
        ...user,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS,
      },
      process.env.JWT_SECRET
    );

    setTokenCookie(res, token);
    let helpUser = await getOrCreateUserByEmail(user, req.body)
    res.status(200).send({ user: user, helpUser: helpUser });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}