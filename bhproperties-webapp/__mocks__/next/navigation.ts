import { jest } from '@jest/globals';

export const useRouter = () => ({
  push: jest.fn(),
});
