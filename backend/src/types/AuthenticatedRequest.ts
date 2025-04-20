import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    user_id: number;
    firm_id: number;
    role: string;
    real_estate_firm: string;
  };
  token?: string;
}
