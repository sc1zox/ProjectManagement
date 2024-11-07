import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import e from "cors";
import jwt from "jsonwebtoken";

class UserController {

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(res.locals.payload); // Just for debugging, consider removing in production

        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!user) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'User not found' });
            }

            res.status(StatusCodes.OK).json({ vorname: user.vorname,nachname: user.nachname });
        } catch (error) {
            next(error);
        }
    }


    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await prisma.user.findMany();
            res.status(StatusCodes.OK).json(users);
        } catch (error) {
            next(error);
        }
    }


    async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { vorname,nachname, password, role } = req.body;
        console.log(req.body);
        
        if (!vorname || !nachname || !password || !role) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (username, password, role) sind erforderlich.',
            });
        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    vorname,
                    nachname,
                    password: hashedPassword,
                    role,
                },
            });

            const token = jwt.sign(
                { id: newUser.id, vorname: newUser.vorname, nachname: newUser.nachname },
                'prosquadra',
                { expiresIn: '1h' }
            );

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: { user: newUser, token },
                details: null,
                error: null,
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

export default new UserController();
