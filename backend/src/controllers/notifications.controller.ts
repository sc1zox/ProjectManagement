import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import { ApiResponse } from '../types/api-response';
import {Notifications} from "@prisma/client";

class NotificationsController {

    async getNotificationsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const notifications = await prisma.notifications.findMany({
                where: {userId: Number(req.params.id)},
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

        if (isRead === undefined || !message || isNaN(userId)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'isRead, message, and valid userId are required.',
            });
            return;
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
            const { id } = req.params;

            const notification = await prisma.notifications.delete({
                where: { id: Number(id) },
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
            const { id } = req.params;

            const notification = await prisma.notifications.update({
                where: { id: Number(id) },
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
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'isRead, message, and valid userId are required.',
            });
            return;
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