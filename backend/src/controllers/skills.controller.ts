import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../types/api-response";
import { Skill } from "@prisma/client";
import {User} from "../types/user";

class SkillsController {

    async getUserSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { skills: true },
            });

            if (!user) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'Benutzer nicht gefunden' });
            }

            const response: ApiResponse<Skill[]> = {
                code: StatusCodes.OK,
                data: user.skills,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async addOrCreateSkillToUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userId, skillName } = req.body;

        if (!userId || !skillName) {
            return next({ status: StatusCodes.BAD_REQUEST, message: 'userId und skillName sind erforderlich' });
        }

        try {
            let skill = await prisma.skill.findUnique({
                where: { name: skillName },
            });

            if (!skill) {
                skill = await prisma.skill.create({
                    data: { name: skillName },
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    skills: {
                        connect: { id: skill.id },
                    },
                },
                include: { skills: true },
            });

            const response: ApiResponse<Skill[]> = {
                code: StatusCodes.OK,
                data: updatedUser.skills,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async removeSkillFromUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userId, skillName } = req.body;

        if (!userId || !skillName) {
            return next({ status: StatusCodes.BAD_REQUEST, message: 'userId und skill Name sind erforderlich' });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    skills: {
                        disconnect: { name: skillName },
                    },
                },
                include: { skills: true },
            });

            const response: ApiResponse<Skill[]> = {
                code: StatusCodes.OK,
                data: updatedUser.skills,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
        const skillId = Number(req.params.id);

        if(isNaN(skillId)){
            return next({status: StatusCodes.BAD_REQUEST,message: 'provide valid SkillId'})
        }

        try {
            await prisma.skill.delete({
                where: { id: skillId },
            });

            res.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new SkillsController();
