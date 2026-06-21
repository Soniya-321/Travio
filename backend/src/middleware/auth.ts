import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as any).user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
