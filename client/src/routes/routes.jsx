import { lazy } from 'react';
import { RootLayout } from '../layouts/RootLayout.jsx';

// Pages are code-split so each route only downloads what it needs.
const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
