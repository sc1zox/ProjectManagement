import {Request, Response, NextFunction} from "express";
import prisma from "../lib/prisma";
import {ApiResponse} from "../types/api-response";
import {Project, Roadmap} from "@prisma/client";
import {StatusCodes} from "http-status-codes";

class RoadmapController {
    async getAllRoadmaps(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const roadmaps = await prisma.roadmap.findMany({
                include: {
                    projects: true,
                    teams: true,
                },
            });

            const response: ApiResponse<Roadmap[]> = {
                code: StatusCodes.OK,
                data: roadmaps,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getRoadmapById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const roadmap = await prisma.roadmap.findUnique({
                where: {id: Number(req.params.id)},
                include: {
                    projects: true,
                }
            });
            if (!roadmap) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Roadmap by ID not found'});
            }

            if (roadmap.projects) {
                roadmap.projects.sort((a, b) => {
                    const priorityA = a.PriorityPosition ?? Number.MAX_VALUE;
                    const priorityB = b.PriorityPosition ?? Number.MAX_VALUE; 

                    return priorityA - priorityB;
                });
            }

            const response: ApiResponse<Roadmap> = {
                code: StatusCodes.OK,
                data: roadmap,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateProjectsPriority(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            console.log(req.body)
            const projects = req.body.projects || (req.body.roadmap && req.body.roadmap.projects);

            if (!projects || !Array.isArray(projects)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: "An array of projects is required.",
                });
            }
            projects.sort((a, b) => a.PriorityPosition - b.PriorityPosition);

            for (const project of projects) {
                await prisma.project.update({
                    where: { id: project.id },
                    data: {
                        PriorityPosition: project.PriorityPosition,
                    },
                });
            }

            const response: ApiResponse<string> = {
                code: StatusCodes.OK,
                data: "Projects' priorities updated successfully.",
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            console.error("Error updating projects:", error);
            next(error);
        }
    }
}

export default new RoadmapController();
