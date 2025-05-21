process.env.NEXT_PUBLIC_API_URL ||= 'http://localhost';

import '@testing-library/jest-dom';
import 'whatwg-fetch';                   

import { server } from './test/testServer';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push:    jest.fn(),
      replace: jest.fn(),
      pathname: '/',
      query:   {},
      prefetch: jest.fn().mockResolvedValue(undefined),
    };
  },
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push:    jest.fn(),
      replace: jest.fn(),
      pathname: '/',
      query:   {},
      prefetch: jest.fn().mockResolvedValue(undefined),
    };
  },
}));
