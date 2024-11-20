import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';

const checkRole = (requiredRole: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.userId;

        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'User not authenticated',
            });
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: 'User not found',
                });
                return;
            }

            if (user.role !== requiredRole) {
                res.status(StatusCodes.FORBIDDEN).json({
                    message: 'Access denied',
                });
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default checkRole;