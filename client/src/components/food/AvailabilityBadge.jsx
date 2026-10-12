import { CircleCheck, CircleX, Clock, Hourglass } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { Badge } from '../ui/Badge.jsx';

// Live availability confirmation states, mirroring AvailabilityRequest.status
// on the server (Phase 6). Only KIPO means the restaurant confirmed the food.
const AVAILABILITY_STYLES = {
  PENDING: { tone: 'warning', dot: true, pulse: true },
  KIPO: { tone: 'success', icon: CircleCheck, variant: 'solid' },
  HAKIPO: { tone: 'danger', icon: CircleX },
  EXPIRED: { tone: 'neutral', icon: Clock },
  CANCELLED: { tone: 'neutral', icon: Hourglass },
};

export function AvailabilityBadge({ status, size }) {
  const { t } = useTranslation();
  const style = AVAILABILITY_STYLES[status];
  if (!style) return null;

  return (
    <Badge size={size} {...style}>
      {t(`availability.status.${status}`)}
    </Badge>
  );
}
