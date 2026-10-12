import { ChefHat, Info, Navigation, Search, ShieldCheck } from 'lucide-react';
import { SystemStatusCard } from '../components/SystemStatusCard.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';
import styles from './HomePage.module.css';

const STEPS = [
  { key: 'search', icon: Search },
  { key: 'confirm', icon: ChefHat },
  { key: 'go', icon: Navigation },
];

// Foundation homepage. The full discovery homepage (search, categories,
// nearby restaurants) is built in Phase 5.
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="container">
          <div className={styles.heroText}>
            <Badge tone="primary" icon={ShieldCheck}>
              {t('home.hero.eyebrow')}
            </Badge>
            <h1 id="hero-title" className={styles.title}>
              {t('home.hero.title')}
            </h1>
            <p className={styles.subtitle}>{t('home.hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="steps-title">
        <h2 id="steps-title" className={styles.sectionTitle}>
          {t('home.steps.title')}
        </h2>
        <ol className={styles.steps} role="list">
          {STEPS.map(({ key, icon: Icon }, index) => (
            <li key={key} className={styles.step} style={{ '--step-delay': `${index * 80}ms` }}>
              <span className={styles.stepIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <h3 className={styles.stepTitle}>{t(`home.steps.${key}.title`)}</h3>
              <p className={styles.stepBody}>{t(`home.steps.${key}.body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container ${styles.foundation}`}>
        <p className={styles.notice}>
          <Info size={18} aria-hidden="true" />
          {t('home.foundationNotice')}
        </p>
        <SystemStatusCard />
      </section>
    </div>
  );
}
