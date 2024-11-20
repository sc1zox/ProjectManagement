import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import jwt from '../utils/jwt';

export default (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'No token provided',
        });
    }

    try {
        const data = jwt.verify(token);
        res.locals.payload = data;

        return next();
    } catch (error) {
        console.error('Token verification error.ts:', error);

        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Unauthorized: Invalid or expired token',
        });
    }
};
