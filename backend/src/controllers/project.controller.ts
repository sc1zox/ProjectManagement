import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import prisma from "../lib/prisma";
import {ApiResponse} from "../types/api-response";
import {Project} from "../types/project";

class ProjectController {
    async createProject(req: Request, res: Response, next: NextFunction): Promise<any> {
        const {name, description, team,PriorityPosition } = req.body;

        if (!name || !description || !team || !team.id || !team.roadmapId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (name, description, team, teamid, team.roadmapId) sind erforderlich.',
            });
        }

        try {
            const existingTeam = await prisma.team.findUnique({
                where: {id: team.id},
            });

            if (!existingTeam) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Das Team wurde nicht gefunden.',
                });
            }
            const newProject = await prisma.project.create({
                data: {
                    name,
                    description,
                    team: {
                        connect: {id: team.id}
                    },
                    roadmap: {
                        connect: {
                            id: team.roadmapId
                        }
                    },
                    PriorityPosition: PriorityPosition,
                },
            });

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: {...newProject},
            });
        } catch (error) {
            next(error);
        }
    }

    async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projects = await prisma.project.findMany();

            if (projects) {
                const response: ApiResponse<Project[]> = {
                    code: StatusCodes.OK,
                    data: projects,
                };
                res.status(StatusCodes.OK).json(response);
                return;
            }
        } catch (error) {
            next(error);
        }
    }

    async getProjectsByTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const teamId = Number(req.params.id);
            if (isNaN(teamId)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: 'Invalid team ID provided',
                });
                return;
            }

            const teamWithProjects = await prisma.team.findUnique({
                where: {id: teamId},
                include: {
                    projects: true,
                },
            });

            if (!teamWithProjects) {
                res.status(StatusCodes.NOT_FOUND).json({
                    code: StatusCodes.NOT_FOUND,
                    message: 'Team not found',
                });
                return;
            }

            const projects = teamWithProjects.projects;

            const response: ApiResponse<Project[]> = {
                code: StatusCodes.OK,
                data: projects,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const project = await prisma.project.findUnique({
                where: {id: Number(req.params.id)},
            });

            if (!project) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Project by ID not found'});
            }
            const response: ApiResponse<Project> = {
                code: StatusCodes.OK,
                data: project,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProjectWithLowestPriorityByUserId(req: Request, res: Response, next: NextFunction): Promise<any> {
        console.log(req.params)
        try {
            const userId = Number(req.params.id);

            if (isNaN(userId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid user ID provided',
                });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    teams: {
                        include: {
                            roadmap: true,
                        },
                    },
                },
            });

            if (!user || user.teams.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'User or associated teams not found',
                });
            }

            const team = user.teams[0]; // If user can have multiple teams, adjust accordingly


            const project = await prisma.project.findFirst({
                where: {
                    teamid: team.id,
                    roadmapId: team.roadmapId,
                    PriorityPosition: 1,
                },
            });

            if (!project) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'No project found with the lowest priority for the team and roadmap',
                });
            }
            const response: ApiResponse<Project> = {
                code: StatusCodes.OK,
                data: project,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }




    async updateProject(req: Request, res: Response, next: NextFunction): Promise<any> {
        const {id, name, description, teamid, startDate, endDate} = req.body;

        try {
            const existingProject = await prisma.project.findUnique({
                where: {id: Number(id)},
            });

            if (!existingProject) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Das Projekt wurde nicht gefunden.',
                });
            }

            const existingTeam = await prisma.team.findUnique({
                where: {id: teamid},
            });

            if (!existingTeam) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Das Team wurde nicht gefunden.',
                });
            }

            const updatedProject = await prisma.project.update({
                where: {id: Number(id)},
                data: {
                    name,
                    description,
                    team: {
                        connect: {id: teamid},
                    },
                    startDate,
                    endDate,
                },
            });

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: updatedProject,
            });
        } catch (error) {
            next(error);
        }
    }


}

export default new ProjectController();