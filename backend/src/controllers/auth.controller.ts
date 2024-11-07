import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import jwt from '../utils/jwt';

class AuthController {
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { vorname, nachname, password } = req.body;


        if (!vorname || !nachname || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Vorname, Nachname and password are required',
            });
        }

        try {

            const user = await prisma.user.findUnique({ where: { vorname_nachname: { vorname, nachname } } });


            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'User not found',
                });
            }


            const isValidPassword = await bcrypt.compare(password, user.password);


            if (!isValidPassword) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid password',
                });
            }


            const token = jwt.sign({ vorname: user.vorname, nachname: user.nachname });


            res.status(StatusCodes.OK).json({ token });
        } catch (error) {

            console.error('Error during authentication:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong during authentication',
            });
        }
    }
    async verify(req: Request, res: Response, next: NextFunction): Promise<any> {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'No token provided',
            });
        }

        try {
            const decoded = jwt.verify(token);

            if (!decoded) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid token',
                });
            }


            res.status(StatusCodes.OK).json({
                message: 'Token is valid',
                user: decoded,
            });
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Token verification failed',
            });
        }
    }
}

export default new AuthController();
