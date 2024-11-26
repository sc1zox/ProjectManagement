import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import { ApiResponse } from '../types/api-response';
import {Notifications} from "@prisma/client";

class NotificationsController {

    async getNotificationsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if(!userId){
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide a valid id'
            });
        }
        try {
            const notifications = await prisma.notifications.findMany({
                where: {userId: userId},
            });

            if (!notifications) {
                return next({status: StatusCodes.NOT_FOUND, message: 'User for Notifications not found'});
            }
            const response: ApiResponse<Notifications[]> = {
                code: StatusCodes.OK,
                data: notifications
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async setNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {isRead, message, userId} = req.body;

        if (isRead === undefined || !message || isNaN(userId) ||!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'isRead, message, and valid userId are required.',
            });
        }

        try {
            const newNotification = await prisma.notifications.create({
                data: {
                    message,
                    isRead,
                    user: {
                        connect: {id: Number(userId)},
                    }
                },
            });

            const response: ApiResponse<Notifications> = {
                code: StatusCodes.CREATED,
                data: newNotification,
            };
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }
    async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const notificationId:number = Number(req.params.id);

            if(!notificationId){
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'provide a valid id'
                })
            }

            const notification = await prisma.notifications.delete({
                where: { id: notificationId },
            });

            if (!notification) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'Notification not found' });
            }

            const response: ApiResponse<Notifications> = {
                code: StatusCodes.OK,
                data: notification,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async markNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const notificationId:number = Number(req.params.id);

            if(!notificationId){
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'provide a valid id'
                })
            }

            const notification = await prisma.notifications.update({
                where: { id: notificationId },
                data: { isRead: true },
            });

            if (!notification) {
                return next({ status: StatusCodes.NOT_FOUND, message: 'Notification not found' });
            }

            const response: ApiResponse<Notifications> = {
                code: StatusCodes.OK,
                data: notification,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async createNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { isRead, message, userId } = req.body;

        if (isRead === undefined || !message || !userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'isRead, message, and valid userId are required.',
            });
        }

        try {
            const newNotification = await prisma.notifications.create({
                data: {
                    message,
                    isRead,
                    user: {
                        connect: { id: Number(userId) },
                    },
                },
            });

            const response: ApiResponse<Notifications> = {
                code: StatusCodes.CREATED,
                data: newNotification,
            };
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new NotificationsController();