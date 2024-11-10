import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types/api-response";
import { Roadmap } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

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
}

export default new RoadmapController();
