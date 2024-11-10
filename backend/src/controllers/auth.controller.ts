import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import jwt from '../utils/jwt';
import {Login} from "../types/login";

// https://github.com/rafaelmfranca/express-prisma-jwt-auth/tree/main

class AuthController {
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username, password }: Login = req.body;


        if (!username || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Vorname, Nachname and password are required',
            });
        }

        try {

            const login = await prisma.login.findUnique({ where: { username } });


            if (!login) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'User not found',
                });
            }


            const isValidPassword = bcrypt.compare(password ,login.password);


            if (!isValidPassword) {
                console.log(isValidPassword)
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid password',
                });
            }


            const token = jwt.sign({username: login.username, userId: login.userId });


            res.status(StatusCodes.OK).json({ token });
        } catch (error) {

            console.error('Error during authentication:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong during authentication',
            });
        }
    }

    async createLogin(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username, password, userId }:Login = req.body;

        if (!username || !password || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
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
                where: { id: userId },
            });

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Benutzer nicht gefunden.',
                });
            }

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: {login: newLogin},
            });
        } catch (error) {
            next(error);
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
