import React from 'react';
import { SessionProvider } from 'next-auth/react';

type AuthProviderProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof SessionProvider>;

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
