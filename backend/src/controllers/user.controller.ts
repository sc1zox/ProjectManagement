import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import {ApiResponse} from "../types/api-response";
import {User} from "../types/user";

class UserController {

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!user) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'User not found' });
            }
            const response: ApiResponse<{ vorname: string; nachname: string }> = {
                code: StatusCodes.OK,
                data: {
                    vorname: user.vorname,
                    nachname: user.nachname,

                },
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }


    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await prisma.user.findMany();

            const response: ApiResponse<User[]> = {
                code: StatusCodes.OK,
                data: users,
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }



    async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { vorname, nachname, role, arbeitszeit } = req.body;

        if (!vorname || !nachname || !role || !arbeitszeit) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (vorname, nachname, role, arbeitszeit) sind erforderlich.',
            });
        }

        try {
            const newUser = await prisma.user.create({
                data: {
                    vorname,
                    nachname,
                    role,
                    arbeitszeit,
                },
            });

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: {...newUser},
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
