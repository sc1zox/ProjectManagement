import {NextFunction, Request, Response} from "express";
import {Team} from "../types/team";
import prisma from "../lib/prisma";
import {StatusCodes} from "http-status-codes";
import {ApiResponse} from "../types/api-response";

class TeamController {

    async getTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const teams: Team[] = await prisma.team.findMany({
                include: {
                    members: true,
                    projects: true,
                }
            });

            if (!teams) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Teams not found'});
            }
            const response: ApiResponse<Team[]> = {
                code: StatusCodes.OK,
                data: teams,
            }
            res.status(StatusCodes.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getTeamByID(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const team = await prisma.team.findUnique({
                where: {id: Number(req.params.id)},
                include: {
                    members: true,
                    roadmap: {
                        include: {
                            projects: {
                                include: {
                                    estimations: true,
                                }
                            }
                        },
                    },
                },
            });

            if (!team) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Team not found'});
            }

            const response: ApiResponse<Team> = {
                code: StatusCodes.OK,
                data: team,
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getTeamByUserID(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide a valid userId'
            });
        }

        try {
            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    teams: {
                        include: {
                            members: true,
                            projects: true,
                        }
                    }
                },
            });

            if (!user) {
                return next({status: StatusCodes.NOT_FOUND, message: 'User not found'});
            }

            const TeamsOfUser = user.teams;
            const response: ApiResponse<Team[]> = {
                code: StatusCodes.OK,
                data: TeamsOfUser,
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }


    async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {name, members} = req.body;
        let newTeamWithoutMember;
        let newTeamWithMember;


        if (!name || !members) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Alle Felder (name, members) müssen ausgefüllt sein',
            });
        }

        try {
            const newRoadmap = await prisma.roadmap.create({
                data: {
                    projects: {create: []},
                },
            });

            const memberIds = members.map((member: { id: number }) => ({id: member.id}));
            if (!memberIds) {
                newTeamWithoutMember = await prisma.team.create({
                    data: {
                        name,
                        roadmap: {
                            connect: {id: newRoadmap.id},
                        },
                    },
                });
                res.status(StatusCodes.CREATED).json({
                    code: StatusCodes.CREATED,
                    data: {...newTeamWithoutMember},
                });
            } else {
                newTeamWithMember = await prisma.team.create({
                    data: {
                        name,
                        members: {
                            connect: memberIds,
                        },
                        roadmap: {
                            connect: {id: newRoadmap.id},
                        },
                    },
                });
                res.status(StatusCodes.CREATED).json({
                    code: StatusCodes.CREATED,
                    data: {...newTeamWithMember},
                });
            }


        } catch (error) {
            next(error);
        }
    }

    async removeUserFromTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {teamId, userId} = req.body;

            if (!teamId || !userId) {
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Alle Felder (teamID, userID) müssen ausgefüllt sein',
                });
            }

            const updatedTeam = await prisma.team.update({
                where: {id: Number(teamId)},
                data: {
                    members: {
                        disconnect: {id: Number(userId)},
                    },
                },
            });

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: updatedTeam,
            });
        } catch (error) {
            next(error);
        }
    }

    async addUserToTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {teamId, userId} = req.body;

            if (!teamId || !userId) {
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Both teamId and userId must be provided',
                });
            }

            const updatedTeam = await prisma.team.update({
                where: {id: Number(teamId)},
                data: {
                    members: {
                        connect: {id: Number(userId)},
                    },
                },
            });

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: updatedTeam,
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new TeamController();