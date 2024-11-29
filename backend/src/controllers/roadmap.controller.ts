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
                    projects: {
                        include: {
                            estimations: true,
                        }
                    },
                    teams: {
                        include:{
                            members: true,
                        }
                    }
                },
            });

            if(roadmaps.length===0){
                return next({status: StatusCodes.NOT_FOUND,message:'Could not find any roadmaps'});
            }

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
        const roadmapId: number = Number(req.params.id);

        if(!roadmapId){
            return next({
                status: StatusCodes.BAD_REQUEST,
                message:'provide a valid roadmapId'
            });
        }
        try {
            const roadmap = await prisma.roadmap.findUnique({
                where: {id: roadmapId},
                include: {
                    projects: true,
                }
            });
            if (!roadmap) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Roadmap by ID not found'});
            }
            // front end already sorts but to make sure this is sorted aswell.
            if (roadmap.projects) {
                roadmap.projects.sort((a, b) => {
                    const priorityA = a.priorityPosition ?? Number.MAX_VALUE;
                    const priorityB = b.priorityPosition ?? Number.MAX_VALUE;

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
    ): Promise<void> {
        try {
            console.log(req.body)
            const projects = req.body.projects || (req.body.roadmap && req.body.roadmap.projects);

            if (!projects || !Array.isArray(projects)) {
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: "An array of projects is required.",
                });
            }
            projects.sort((a, b) => a.priorityPosition - b.priorityPosition);

            for (const project of projects) {
                await prisma.project.update({
                    where: { id: project.id },
                    data: {
                        priorityPosition: project.priorityPosition,
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
