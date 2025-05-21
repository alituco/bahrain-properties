import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { server } from '../../../test/testServer';
import Profile from '@/pages/profile'; 

const API = process.env.NEXT_PUBLIC_API_URL!;
const user = userEvent.setup();

async function openSecurityTab() {
  const tab = await screen.findByRole('tab', { name: /^security$/i });
  await user.click(tab);
}

const queryFirmInput = () =>
  screen.queryByPlaceholderText(/bh\-firm\-001/i) as HTMLInputElement | null;

describe('Profile – admin flow', () => {
  it('shows firm code to admins and updates it on save', async () => {
    const adminUser = {
      user_id: 1,
      email: 'admin@firm.com',
      role: 'admin',
      firm_id: 99,
      firm_registration_code: 'BH-OLD',
    };

    server.use(
      rest.get(`${API}/user/me`, (_req, res, ctx) =>
        res(ctx.json({ user: adminUser })),
      ),
      rest.put(
        '*://*/user/firms/:firmId/registration-code',
        async (req, res, ctx) => {
          expect(req.params.firmId).toBe('99');
          const { new_code } = await req.json();
          expect(new_code).toBe('BH-NEW');
          return res(ctx.json({ success: true }));
        },
      ),
    );

    render(<Profile />);

    const codeInput = await screen.findByPlaceholderText(/bh\-firm\-001/i);
    expect(codeInput).toHaveValue('BH-OLD');

    await user.clear(codeInput);
    await user.type(codeInput, 'BH-NEW');
    await user.click(screen.getByRole('button', { name: /save code/i }));

    expect(await screen.findByText(/firm code updated/i)).toBeInTheDocument();
  });
});

describe('Profile – staff flow', () => {
  it('hides firm code for non-admins', async () => {
    const staffUser = {
      user_id: 7,
      email: 'staff@firm.com',
      role: 'staff',
      firm_id: 99,
      firm_registration_code: null,
    };

    server.use(
      rest.get(`${API}/user/me`, (_req, res, ctx) =>
        res(ctx.json({ user: staffUser })),
      ),
    );

    render(<Profile />);

    await screen.findByRole('tab', { name: /^profile$/i });
    expect(queryFirmInput()).toBeNull();
  });
});

describe('Profile – change password', () => {
  beforeEach(() => {
    server.use(
      rest.get(`${API}/user/me`, (_req, res, ctx) =>
        res(
          ctx.json({
            user: {
              user_id: 5,
              email: 'user@firm.com',
              role: 'staff',
              firm_id: 99,
              firm_registration_code: null,
            },
          }),
        ),
      ),
    );
  });

  async function fillPasswordForm(
    current: string,
    next: string,
    confirm: string,
  ) {
    await openSecurityTab();

    const pane = await screen.findByRole('tabpanel', { name: /security/i });
    const inputs = within(pane).getAllByRole('textbox');

    const [currentPw, newPw, confirmPw] = inputs;
    await user.type(currentPw, current);
    await user.type(newPw, next);
    await user.type(confirmPw, confirm);
    await user.click(
      screen.getByRole('button', { name: /change password/i }),
    );
  }

  it('shows success banner on correct current password', async () => {
    server.use(
      rest.post(`${API}/user/change-password`, (_req, res, ctx) =>
        res(ctx.json({ success: true })),
      ),
    );

    render(<Profile />);
    await fillPasswordForm('oldPass!', 'newPass123', 'newPass123');

    const dlg = await screen.findByText(/are you sure/i);
    await user.click(
      within(dlg.parentElement as HTMLElement).getByRole('button', {
        name: /yes, save/i,
      }),
    );

    expect(
      await screen.findByText(/password changed/i),
    ).toBeInTheDocument();
  });

  it('shows error banner on backend failure', async () => {
    server.use(
      rest.post(`${API}/user/change-password`, (_req, res, ctx) =>
        res(ctx.json({ success: false, message: 'Wrong current password' })),
      ),
    );

    render(<Profile />);
    await fillPasswordForm('badPass', 'x', 'x');

    const dlg = await screen.findByText(/are you sure/i);
    await user.click(
      within(dlg.parentElement as HTMLElement).getByRole('button', {
        name: /yes, save/i,
      }),
    );

    expect(
      await screen.findByText(/wrong current password/i),
    ).toBeInTheDocument();
  });
});
