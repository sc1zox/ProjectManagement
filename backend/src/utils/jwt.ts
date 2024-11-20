import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'prosquadra';

export default {
    sign: (payload: { username: String,userId: number }) =>
        jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' }),

    verify: (token: string) => jwt.verify(token, SECRET),
};