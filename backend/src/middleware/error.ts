import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'An unexpected error occurred';
    const details = err.details || null;

    res.status(status).json({
        code: status,
        message,
        details,
        error: err.stack || null,
    });
}
