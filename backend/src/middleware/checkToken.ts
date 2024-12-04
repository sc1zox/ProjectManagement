import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from '../utils/jwt';
import { AuthenticatedRequest } from '../types/AuthenticateRequest';
import { JwtPayload } from 'jsonwebtoken';

const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'No token provided',
        });
        return;
    }

    try {
        const data = jwt.verify(token) as JwtPayload & { userId: number };
        req.userId = data.userId;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized: Invalid or expired token',
        });
    }
};

export default isAuthenticated;
