import bcrypt from 'bcryptjs';
import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import prisma from '../lib/prisma';
import jwt from '../utils/jwt';
import {Login} from "../types/login";

// https://github.com/rafaelmfranca/express-prisma-jwt-auth/tree/main

class AuthController {
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {username, password}: Login = req.body;
        if (!username || !password) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Username and password are required',
            });
        }

        try {
            const login = await prisma.login.findUnique({where: {username}});
            if (!login) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'User not found',
                });
            }
            const isValidPassword = await bcrypt.compare(password, login.password);
            if (!isValidPassword) {
                next({
                    status: StatusCodes.UNAUTHORIZED,
                    message: 'Invalid password',
                });
            }
            const token = jwt.sign({username: login.username, userId: login.userId});
            res.status(StatusCodes.OK).json({token});
        } catch (error) {
            console.error('Error during authentication:', error);
            return next({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Something went wrong during authentication',
            });
        }
    }

    async createLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {username, password, userId}: Login = req.body;

        if (!username || !password || !userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Benutzername, Passwort und UserID sind erforderlich.',
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);


            const newLogin = await prisma.login.create({
                data: {
                    username,
                    password: hashedPassword,
                    userId,
                },
            });


            const user = await prisma.user.findUnique({
                where: {id: userId},
            });

            if (!user) {
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Benutzer nicht gefunden.',
                });
            }

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: {login: newLogin},
            });
        } catch (error) {
            if (error.code === 'P2002') {
                return next({
                    status: StatusCodes.CONFLICT,
                    message: 'Der Benutzername existiert bereits.',
                });
            }
            next(error);
        }
    }

    async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'No token provided',
            });
            return
        }

        try {
            const decoded = jwt.verify(token);

            if (!decoded) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid token',
                });
                return
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
            next(error)
        }
    }
}

export default new AuthController();
