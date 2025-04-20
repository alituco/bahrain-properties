import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const ensureAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res
      .status(401)
      .json({ message: 'Not authenticated.' });
    return;
  }

  if (user.role !== 'admin') {
    res
      .status(403)
      .json({ message: 'Forbidden: Admins only.' });
      return;
  }

  next();
};
