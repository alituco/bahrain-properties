import { setupServer } from 'msw/node';
import { rest } from 'msw';                   
export const handlers = [
  rest.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, (_req, res, ctx) =>
    res(ctx.json({ success: true }))
  ),
  rest.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, (_req, res, ctx) =>
    res(ctx.json({ success: true }))
  ),
];

export const server = setupServer(...handlers);
