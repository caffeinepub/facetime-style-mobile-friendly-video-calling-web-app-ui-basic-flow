import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthStatus from './AuthStatus';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/facetime-clone-icon.dim_512x512.png" 
              alt="App Icon" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-xl font-semibold tracking-tight">VideoCall</h1>
          </div>
          {isAuthenticated && <AuthStatus />}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
