import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../lib/prisma';
import jwt from '../utils/jwt';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { Callback } from 'express-rescue';
import { JwtPayload } from 'jsonwebtoken';

const checkRole = (requiredRole: string, rescue: Callback) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return next({
                    status: StatusCodes.UNAUTHORIZED,
                    message: 'No token provided',
                });
            }

            const data = jwt.verify(token) as JwtPayload & { userId: number };
            res.locals.payload = data;

            req.userId = data.userId;

            const user = await prisma.user.findUnique({
                where: { id: req.userId },
            });

            if (!user) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'User not found',
                });
            }
            if (user.role !== requiredRole) {
                return next({
                    status: StatusCodes.FORBIDDEN,
                    message: 'Access denied',
                });
            }
            return rescue(req, res, next);
        } catch (error) {
            console.error('Role verification error:', error);
            return next({
                status: StatusCodes.UNAUTHORIZED,
                message: 'Unauthorized: Invalid or expired token',
            });
        }
    };
};

export default checkRole;
