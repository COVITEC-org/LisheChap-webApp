import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { I18nProvider } from './lib/i18n/I18nProvider.jsx';
import { routes } from './routes/routes.jsx';

export default function App({ router: providedRouter }) {
  const [router] = useState(() => providedRouter ?? createBrowserRouter(routes));

  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
