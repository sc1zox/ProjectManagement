import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from '../utils/jwt';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { JwtPayload } from 'jsonwebtoken';

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'No token provided',
        });
    }

    try {
        const data = jwt.verify(token) as JwtPayload & { userId: number };
        res.locals.payload = data;

        req.userId = data.userId;

        return next();
    } catch (error) {
        console.error('Token verification error:', error);

        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Unauthorized: Invalid or expired token',
        });
    }
};