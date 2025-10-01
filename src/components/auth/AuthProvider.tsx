import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppProps } from 'next/app';

interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
