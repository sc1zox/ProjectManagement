import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import jwt from '../utils/jwt';

class AuthController {
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Username and password are required',
            });
            return;
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'User not found',
            });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid password',
            });
            return;
        }


        const token = jwt.sign({ username: user.username });

        res.status(StatusCodes.OK).json({ token });
    }
}

export default new AuthController();
