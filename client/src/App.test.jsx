import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { routes } from './routes/routes.jsx';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function healthReport(databaseStatus) {
  return {
    status: databaseStatus === 'up' ? 'ok' : 'degraded',
    services: { api: { status: 'up' }, database: { status: databaseStatus } },
  };
}

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<App router={router} />);
}

describe('App', () => {
  it('renders the Swahili homepage and reports a healthy system', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ success: true, data: healthReport('up') })));

    renderAt('/');

    expect(await screen.findByRole('heading', { level: 1, name: 'Chakula unachotaka, karibu nawe.' })).toBeInTheDocument();
    expect(await screen.findAllByText('Inafanya kazi')).toHaveLength(2);
  });

  it('shows the database as unavailable when the server reports degraded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ success: false, data: healthReport('down') }, 503)),
    );

    renderAt('/');

    expect(await screen.findByText('Haipatikani')).toBeInTheDocument();
    expect(screen.getByText('Inafanya kazi')).toBeInTheDocument();
  });

  it('shows an error message when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    renderAt('/');

    expect(await screen.findByRole('alert')).toHaveTextContent('Imeshindikana kuwasiliana na seva');
  });

  it('renders the not-found page for unknown routes', async () => {
    vi.stubGlobal('fetch', vi.fn());

    renderAt('/hakuna-ukurasa');

    expect(await screen.findByRole('heading', { name: 'Ukurasa haupatikani' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rudi nyumbani' })).toHaveAttribute('href', '/');
  });
});
