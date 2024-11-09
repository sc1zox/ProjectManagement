import {NextFunction, Request, Response} from "express";
import {Team} from "../types/team";
import prisma from "../lib/prisma";
import {StatusCodes} from "http-status-codes";
import {ApiResponse} from "../types/api-response";

class TeamController {

    async getTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const teams: Team[] = await prisma.team.findMany();

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
            });

            if (!team) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Team not found'});
            }
            const response: ApiResponse<Team> = {
                code: StatusCodes.OK,
                data: team,
            }
            res.status(StatusCodes.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    async createTeam(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { name, members } = req.body;

        if (!name || !members || members.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (name, members) müssen ausgefüllt sein',
            });
        }

        try {
            const memberIds = members.map((member: { id: number }) => ({ id: member.id }));

            const newTeam = await prisma.team.create({
                data: {
                    name,
                    members: {
                        connect: memberIds,
                    },
                },
            });


            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: { ...newTeam },
            });
        } catch (error) {
            next(error);
        }
    }

}
export default new TeamController();