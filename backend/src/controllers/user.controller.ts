import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import prisma from '../lib/prisma';
import {ApiResponse} from "../types/api-response";
import {User} from "../types/user";
import {Urlaub} from "../types/Urlaub";

class UserController {

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide a valid id'
            });
        }
        try {
            const user = await prisma.user.findUnique({
                where: {id: userId},
            });

            if (!user) {
                return next({status: StatusCodes.NOT_FOUND, message: 'User not found'});
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
                    urlaub: true,
                },
            });

            if (users.length === 0) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'No users found.',
                });
            }

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
        const {vorname, nachname, role, arbeitszeit, teams, urlaubstage} = req.body;

        if (!vorname || !nachname || !role || !arbeitszeit || !teams) {
            return next({
                code: StatusCodes.BAD_REQUEST,
                message: 'Alle Felder (vorname, nachname, role, arbeitszeit, teamID) sind erforderlich.',
            });
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
                        connect: teams.map((teamId: number) => ({id: teamId}))
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
        const {userID, arbeitszeit} = req.body;

        if (!userID || !arbeitszeit) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'userID und arbeitszeit sind erforderlich.',
            });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: {id: Number(userID)},
                data: {arbeitszeit},
            });

            const response: ApiResponse<{ arbeitszeit: number }> = {
                code: StatusCodes.OK,
                data: {arbeitszeit: updatedUser.arbeitszeit},
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getEstimationsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = Number(req.params.id);

        if (isNaN(userId) || !userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Invalid user ID provided.',
            });

        }

        try {
            const estimations = await prisma.estimation.findMany({
                where: {userId},
            });

            if (estimations.length === 0) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'No estimations found for the user.',
                });
            }

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: estimations,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserVacationsById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (isNaN(userId) || !userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Invalid user ID provided',
            });
        }

        try {
            const vacations = await prisma.urlaub.findMany({
                where: {userId}
            });
            if (vacations.length === 0) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'No vacations found for the user.',
                });
            }

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: vacations,
            });
        } catch (error) {
            next(error);
        }
    }
    async addVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userId, startDatum, endDatum } = req.body;

        if (!userId || !startDatum || !endDatum) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'userId, startDate, and endDate are required.',
            });
        }

        try {
            const overlappingVacations = await prisma.urlaub.findMany({
                where: {
                    userId: Number(userId),
                    OR: [
                        {
                            startDatum: {
                                gte: new Date(startDatum),
                            },
                            endDatum: {
                                lte: new Date(endDatum),
                            },
                        },
                        {
                            startDatum: {
                                lte: new Date(startDatum),
                            },
                            endDatum: {
                                gte: new Date(endDatum),
                            },
                        },
                        {
                            startDatum: {
                                lt: new Date(startDatum),
                            },
                            endDatum: {
                                gte: new Date(startDatum),
                            },
                        },
                        {
                            startDatum: {
                                lte: new Date(endDatum),
                            },
                            endDatum: {
                                gt: new Date(endDatum),
                            },
                        },
                    ],
                },
            });
            if (overlappingVacations.length > 0) {
                return next({
                    status: StatusCodes.CONFLICT,
                    message: 'The vacation dates overlap with an existing vacation.',
                });
            }

            const newVacation: Urlaub = await prisma.urlaub.create({
                data: {
                    userId: Number(userId),
                    startDatum: new Date(startDatum),
                    endDatum: new Date(endDatum),
                },
            });
            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: newVacation,
            });
        } catch (error) {
            next(error);
        }
    }
    async updateUrlaubstage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userID, urlaubstage } = req.body;

        if (!userID || !urlaubstage) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'userID and urlaubstage are required.',
            });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: Number(userID) },
                data: { urlaubstage },
            });

            const response: ApiResponse<{ urlaubstage: number }> = {
                code: StatusCodes.OK,
                data: { urlaubstage: updatedUser.urlaubstage },
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const urlaubId: number=Number(req.params.id);

        if (!urlaubId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'urlaubsId is required.',
            });
        }

        try {
            const deletedVacation = await prisma.urlaub.delete({
                where: { id: urlaubId },
            });

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: deletedVacation,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
