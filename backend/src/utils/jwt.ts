import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'prosquadra';

export default {
    sign: (payload: { vorname: string,nachname: string }) =>
        jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' }),

    verify: (token: string) => jwt.verify(token, SECRET),
};