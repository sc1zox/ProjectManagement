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


    async getAllUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await prisma.user.findMany({
                include: {
                    skills: true,
                    teams: true,
                },
            });

            const response: ApiResponse<User[]> = {
                code: StatusCodes.OK,
                data: users,
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }



    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(req.body)
        const { vorname, nachname, role, arbeitszeit, teams, urlaubstage} = req.body;

        if (!vorname || !nachname || !role || !arbeitszeit || !teams) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (vorname, nachname, role, arbeitszeit, teamID) sind erforderlich.',
            });
            return;
        }



        try {
            const newUser = await prisma.user.create({
                data: {
                    vorname,
                    nachname,
                    role,
                    arbeitszeit,
                    urlaubstage,
                    teams: {
                        connect: teams.map((teamId: number) => ({ id: teamId }))
                    }
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
    async updateArbeitszeit(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userID, arbeitszeit } = req.body;

        if (!userID || arbeitszeit === undefined) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'userID und arbeitszeit sind erforderlich.',
            });
            return;
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: Number(userID) },
                data: { arbeitszeit },
            });

            const response: ApiResponse<{ arbeitszeit: number }> = {
                code: StatusCodes.OK,
                data: { arbeitszeit: updatedUser.arbeitszeit },
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

}

export default new UserController();
