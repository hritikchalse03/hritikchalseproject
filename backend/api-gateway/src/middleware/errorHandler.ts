import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error details
  console.error('Error occurred:', {
    message,
    statusCode,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  const responseMessage = config.env === 'production' && statusCode === 500
    ? 'Something went wrong!'
    : message;

  const responseStack = config.env === 'development' ? error.stack : undefined;

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Client Error',
    message: responseMessage,
    ...(responseStack && { stack: responseStack }),
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};