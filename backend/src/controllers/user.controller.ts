import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import {Project} from "../types/project";
import {ApiResponse} from "../types/api-response";
import {User,UserRole} from "../types/user";
import {Team} from "../types/team";

class UserController {

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

    async getTeams(req: Request, res:Response, next:NextFunction): Promise<void>{
        try {
            const teams: Team[] = await prisma.team.findMany();

            if (!teams) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Teams not found'});
            }
            const response: ApiResponse<Team[]>={
                code: StatusCodes.OK,
                data: teams,
            }
            res.status(StatusCodes.OK).json(response)
        }catch (error){
            next(error)
        }
    }
    async getTeamByID(req: Request, res:Response, next:NextFunction): Promise<void>{
        try {
            const team = await prisma.team.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!team) {
                return next({status: StatusCodes.NOT_FOUND, message: 'Team not found'});
            }
            const response: ApiResponse<Team>={
                code: StatusCodes.OK,
                data: team,
            }
            res.status(StatusCodes.OK).json(response)
        }catch (error){
            next(error)
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!user) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'User not found' });
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


    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await prisma.user.findMany();

            const mappedUsers: User[] = users.map(user => ({ //das mapping sollte eig überflüssig sein aber ts hat probleme mit dem typ
                ...user,
                role: UserRole[user.role]
            }));

            const response: ApiResponse<User[]> = {
                code: StatusCodes.OK,
                data: mappedUsers,
            };

            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }


    async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { vorname,nachname, password, role,arbeitszeit } = req.body;
        console.log(req.body);
        
        if (!vorname || !nachname || !password || !role || !arbeitszeit) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Alle Felder (username, password, role und arbeitszeit) sind erforderlich.',
            });
        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    vorname,
                    nachname,
                    password: hashedPassword,
                    role,
                    arbeitszeit,
                },
            });

            const token = jwt.sign(
                { id: newUser.id, vorname: newUser.vorname, nachname: newUser.nachname },
                'prosquadra',
                { expiresIn: '1h' }
            );

            res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                data: { user: newUser, token },
                details: null,
                error: null,
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

export default new UserController();
