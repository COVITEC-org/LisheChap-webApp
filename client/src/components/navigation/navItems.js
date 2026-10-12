import { House, Palette } from 'lucide-react';

// Primary navigation. Only routes that exist are listed, so no link leads to
// an unfinished screen. Discovery, orders and profile join here in later phases.
const BASE_ITEMS = [{ to: '/', labelKey: 'nav.home', icon: House, end: true }];

// The design system reference is a development tool and is never shipped as a route in production.
const DEV_ITEMS = import.meta.env.DEV
  ? [{ to: '/mfumo-wa-muundo', labelKey: 'nav.designSystem', icon: Palette }]
  : [];

export const PRIMARY_NAV_ITEMS = [...BASE_ITEMS, ...DEV_ITEMS];
