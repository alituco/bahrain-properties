jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { render, screen, waitFor, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import LoginWithOTP from '../../auth/LoginWithOTP';

import { server } from '../../../test/testServer';
import { rest } from 'msw';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!;

// helper func to get input elements by name
function getInput(name: string): HTMLInputElement {
  return document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

describe('LoginWithOTP flow', () => {
  it('shows OTP modal on successful login, then redirects on valid OTP', async () => {

    // Mock the server response for login
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<LoginWithOTP />);

    //fill the form with valid creds
    await user.type(getInput('email'), 'ali@example.com');
    await user.type(getInput('password'), 'secret123');
    await user.click(screen.getByRole('button', { name: /send otp/i }));

    // wait for otp modal to show
    expect(await screen.findByText(/enter otp/i)).toBeInTheDocument();

    // fill otp and submit
    const modal = screen.getByRole('dialog');
    const otpInput = within(modal).getByRole('textbox');
    await user.type(otpInput, '123456');
    await user.click(within(modal).getByRole('button', { name: /verify/i }));

    // wait for redirection to dashboard
    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows backend error on bad credentials', async () => {

    // Mock the server response for login
    server.use(
      rest.post(`${API}/auth/login`, (_req, res, ctx) =>
        res(ctx.json({ success: false, message: 'Invalid creds' }))
      )
    );

    render(<LoginWithOTP />);

    // fill form with wrong creds
    await user.type(getInput('email'), 'bad@user.com');
    await user.type(getInput('password'), 'wrong');
    await user.click(screen.getByRole('button', { name: /send otp/i }));

    // error message should show
    expect(await screen.findByText(/invalid creds/i)).toBeInTheDocument();
  });
});
