import { lazy } from 'react';
import { RootLayout } from '../layouts/RootLayout.jsx';
// Loaded eagerly: it must render even when a lazy page chunk fails to download.
import RouteErrorPage from '../pages/RouteErrorPage.jsx';

// Pages are code-split so each route only downloads what it needs.
const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

// Development-only design system reference. The condition is replaced at build
// time, so production bundles contain neither the route nor its sample data.
const devRoutes = import.meta.env.DEV
  ? [
      {
        path: 'mfumo-wa-muundo',
        Component: lazy(() => import('../features/design-system/DesignSystemPage.jsx')),
      },
    ]
  : [];

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
