import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, () =>
    HttpResponse.json({ success: true })
  ),
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, () =>
    HttpResponse.json({ success: true })
  ),
];
export const server = setupServer(...handlers);
