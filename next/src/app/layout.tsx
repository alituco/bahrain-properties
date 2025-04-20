"use client";

import { K2D } from 'next/font/google';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme'; 

const k2d = K2D({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-k2d',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={k2d.variable}>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
