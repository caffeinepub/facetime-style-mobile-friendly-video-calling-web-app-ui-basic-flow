import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import RequireAuth from './components/RequireAuth';
import SignInPage from './pages/SignInPage';
import ContactsPage from './pages/ContactsPage';
import CallSetupPage from './pages/CallSetupPage';
import InCallPage from './pages/InCallPage';
import CallEndedPage from './pages/CallEndedPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SignInPage,
});

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  component: () => (
    <RequireAuth>
      <ContactsPage />
    </RequireAuth>
  ),
});

const callSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/call-setup',
  component: () => (
    <RequireAuth>
      <CallSetupPage />
    </RequireAuth>
  ),
});

const inCallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/call/$sessionId',
  component: () => (
    <RequireAuth>
      <InCallPage />
    </RequireAuth>
  ),
});

const callEndedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/call-ended',
  component: () => (
    <RequireAuth>
      <CallEndedPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  contactsRoute,
  callSetupRoute,
  inCallRoute,
  callEndedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
