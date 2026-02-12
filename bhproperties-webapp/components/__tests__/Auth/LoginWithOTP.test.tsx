import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../../test/testServer';
import { useRouter } from 'next/navigation';
import LoginWithOTP from '../../auth/LoginWithOTP';

const API = process.env.NEXT_PUBLIC_API_URL!;

// next/router
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

function getInput(name: string): HTMLInputElement {
  return document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

describe('LoginWithOTP flow', () => {
  it('shows OTP modal on successful login, then redirects on valid OTP', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    server.use(
      rest.post(`${API}/auth/login`, (_req, res, ctx) =>
        res(ctx.json({ success: true }))
      ),
      rest.post(`${API}/auth/verify-otp`, (_req, res, ctx) =>
        res(ctx.json({ success: true }))
      )
    );

    render(<LoginWithOTP />);

    await user.type(getInput('email'), 'ali@example.com');
    await user.type(getInput('password'), 'secret123');
    await user.click(screen.getByRole('button', { name: /send otp/i }));

    expect(await screen.findByText(/enter otp/i)).toBeInTheDocument();

    const modal = screen.getByRole('dialog');
    await user.type(within(modal).getByRole('textbox'), '123456');
    await user.click(within(modal).getByRole('button', { name: /verify/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows backend error on bad credentials', async () => {
    server.use(
      rest.post(`${API}/auth/login`, (_req, res, ctx) =>
        res(ctx.json({ success: false, message: 'Invalid creds' }))
      )
    );

    render(<LoginWithOTP />);

    await user.type(getInput('email'), 'bad@user.com');
    await user.type(getInput('password'), 'wrong');
    await user.click(screen.getByRole('button', { name: /send otp/i }));

    expect(await screen.findByText(/invalid creds/i)).toBeInTheDocument();
  });
});
