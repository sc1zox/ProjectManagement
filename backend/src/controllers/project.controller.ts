import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import prisma from "../lib/prisma";
import {ApiResponse} from "../types/api-response";
import {Project} from "../types/project";

class ProjectController{
    async createProject(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { name, description, team } = req.body;

        if (!name || !description || !team || !team.id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (name, description, team) sind erforderlich und Team-ID muss vorhanden sein.',
            });
        }

        try {
            const existingTeam = await prisma.team.findUnique({
                where: { id: team.id },
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
                        connect: { id: team.id }
                    }
                },
            });

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: { ...newProject },
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

    async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const project = await prisma.project.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!project) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'Project by ID not found' });
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
        const { id, name, description, teamid, startDate, endDate } = req.body;

        try {
            const existingProject = await prisma.project.findUnique({
                where: { id: Number(id) },
            });

            if (!existingProject) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Das Projekt wurde nicht gefunden.',
                });
            }

            const existingTeam = await prisma.team.findUnique({
                where: { id: teamid },
            });

            if (!existingTeam) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Das Team wurde nicht gefunden.',
                });
            }

            const updatedProject = await prisma.project.update({
                where: { id: Number(id) },
                data: {
                    name,
                    description,
                    team: {
                        connect: { id: teamid },
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