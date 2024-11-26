import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import prisma from "../lib/prisma";
import {ApiResponse} from "../types/api-response";
import {Project} from "../types/project";
import {Estimation} from "../types/estimation";

class ProjectController {
    async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {name, description, team, PriorityPosition} = req.body;

        if (!name || !description || !team || !team.id || !team.roadmapId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Alle Felder (name, description, team, teamid, team.roadmapId) sind erforderlich.',
            });
        }

        try {
            const existingTeam = await prisma.team.findUnique({
                where: {id: team.id},
            });

            if (!existingTeam) {
                return next({
                    status: StatusCodes.NOT_FOUND,
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
                    projectStatus: 'offen',
                    priorityPosition: PriorityPosition,
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
            const projects:Project[] = await prisma.project.findMany();

            if(projects.length===0){
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message:'Could not find any projects'
                });
            }

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
            if (isNaN(teamId) || !teamId) {
                return next({
                    code: StatusCodes.BAD_REQUEST,
                    message: 'Invalid team ID provided',
                });
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
        const projectId = Number(req.params.id);
        if(!projectId){
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide a valid projectId'
            });
        }
        try {
            const project = await prisma.project.findUnique({
                where: {id: projectId},
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

    async getProjectWithLowestPriorityByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.id);

            if (isNaN(userId) || !userId) {
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Invalid user ID provided',
                });
            }

            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    teams: {
                        include: {
                            roadmap: true,
                        },
                    },
                },
            });

            if (!user || user.teams.length === 0) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'User or associated teams not found',
                });
            }

            const team = user.teams[0]; // If user can have multiple teams, adjust accordingly


            const project = await prisma.project.findFirst({
                where: {
                    teamid: team.id,
                    roadmapId: team.roadmapId,
                    priorityPosition: 1,
                },
            });

            if (!project) {
                return next({
                    status: StatusCodes.NOT_FOUND,
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


    async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id, name, description, teamid, startDate, endDate} = req.body;

        if(!id || !teamid){
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide valid id or teamid'
            })
        }

        try {
            const existingProject = await prisma.project.findUnique({
                where: {id: Number(id)},
            });

            if (!existingProject) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'Das Projekt wurde nicht gefunden.',
                });
            }

            const existingTeam = await prisma.team.findUnique({
                where: {id: teamid},
            });

            if (!existingTeam) {
                return next({
                    status: StatusCodes.NOT_FOUND,
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

    async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectId = Number(req.params.id);

            if (isNaN(projectId) || !projectId) {
                return next({
                   status: StatusCodes.BAD_REQUEST,
                   message: 'Invalid project ID provided',
                });
            }
            const projectToDelete = await prisma.project.findUnique({
                where: {id: projectId},
            });

            if (!projectToDelete) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'Project not found',
                });
            }
            await prisma.project.delete({
                where: {id: projectId},
            });
            const remainingProjects = await prisma.project.findMany({
                where: {
                    teamid: projectToDelete.teamid,
                    roadmapId: projectToDelete.roadmapId,
                },
                orderBy: {priorityPosition: 'asc'},
            });
            for (let i = 0; i < remainingProjects.length; i++) {
                await prisma.project.update({
                    where: {id: remainingProjects[i].id},
                    data: {priorityPosition: i + 1},
                });
            }

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                message: 'Project deleted and priorities updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async addEstimationToProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {projectId, estimationHours, userId} = req.body;

        if (!projectId || !estimationHours || !userId) {
            return next({
               status: StatusCodes.BAD_REQUEST,
               message: 'projectId, estimationHours, and userId are required.',
            });
        }

        try {
            const existingProject = await prisma.project.findUnique({
                where: {id: Number(projectId)},
            });

            if (!existingProject) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'Project not found.',
                });
            }

            const existingEstimation = await prisma.estimation.findUnique({
                where: {
                    projectId_userId: {
                        projectId: Number(projectId),
                        userId: Number(userId),
                    },
                },
            });

            let newEstimation: Estimation;
            if (existingEstimation) {
                newEstimation = await prisma.estimation.update({
                    where: {
                        id: existingEstimation.id,
                    },
                    data: {
                        hours: estimationHours,
                    },
                });
            } else {
                newEstimation = await prisma.estimation.create({
                    data: {
                        hours: estimationHours,
                        projectId: existingProject.id,
                        userId: Number(userId),
                    },
                });
            }

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: newEstimation,
            });
        } catch (error) {
            next(error);
        }
    }

    async getEstimationsWithAverage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const projectId = Number(req.params.id);

        if (isNaN(projectId)) {
            return next({
               status: StatusCodes.BAD_REQUEST,
                message: 'Invalid project ID provided.',
            });
        }

        try {
            const estimations = await prisma.estimation.findMany({
                where: {projectId: Number(projectId)},
            });

            if (estimations.length === 0) {
                res.status(StatusCodes.OK).json({
                    message: 'No estimations found for the project.',
                    data: -1337,
                });
                return;
            }

            const averageEstimation = await prisma.estimation.aggregate({
                _avg: {
                    hours: true,
                },
                where: {
                    projectId: Number(projectId),
                },
            });

            res.status(StatusCodes.OK).json({
                code: StatusCodes.OK,
                data: averageEstimation._avg.hours,

            });
        } catch (error) {
            next(error);
        }
    }

    async updateProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { projectId, projectStatus } = req.body;

        if (!projectId || !projectStatus) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'projectId and status are required.',
            });
        }

        try {
            const existingProject = await prisma.project.findUnique({
                where: { id: Number(projectId) },
            });

            if (!existingProject) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'Project not found.',
                });
            }

            const updatedProject = await prisma.project.update({
                where: { id: Number(projectId) },
                data: { projectStatus: projectStatus },
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