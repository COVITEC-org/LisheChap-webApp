import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { useTheme } from '../../lib/theme/useTheme.js';
import { IconButton } from '../ui/IconButton.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';

const ICONS = { light: Sun, dark: Moon, system: Monitor };
const CYCLE = { system: 'light', light: 'dark', dark: 'system' };

/** Compact header control: cycles system, light, dark. */
export function ThemeToggle({ variant = 'ghost' }) {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();

  return (
    <IconButton
      icon={ICONS[preference]}
      variant={variant}
      label={t('theme.toggle', { mode: t(`theme.${preference}`) })}
      onClick={() => setPreference(CYCLE[preference])}
    />
  );
}

/** Explicit three-way choice, used in menus and settings. */
export function ThemeSwitcher({ fullWidth }) {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();

  return (
    <SegmentedControl
      label={t('theme.label')}
      value={preference}
      onChange={setPreference}
      fullWidth={fullWidth}
      options={['light', 'dark', 'system'].map((mode) => ({
        value: mode,
        label: t(`theme.${mode}`),
        icon: ICONS[mode],
      }))}
    />
  );
}
