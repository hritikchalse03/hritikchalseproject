import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithId extends Request {
  id: string;
}

export const requestLogger = (
  req: RequestWithId,
  res: Response,
  next: NextFunction
) => {
  // Generate unique request ID
  req.id = uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.id);
  
  const startTime = Date.now();
  
  // Log request details
  console.log(`📨 [${req.id}] ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
  
  // Override res.end to log response details
  const originalEnd = res.end;
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    
    console.log(`📤 [${req.id}] ${res.statusCode} - ${duration}ms`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};