import { Info, ShieldCheck, Timer } from 'lucide-react';
import { SystemStatusCard } from '../components/SystemStatusCard.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';
import styles from './HomePage.module.css';

const STEPS = ['search', 'confirm', 'go'];

// Foundation homepage laid out like the reference's top section (hero banner
// plus a "how it works" column). The full discovery homepage (search,
// categories, nearby restaurants, deals) is built in Phase 5.
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.top}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>
            <ShieldCheck size={16} aria-hidden="true" />
            {t('home.hero.eyebrow')}
          </p>
          <h1 id="hero-title" className={styles.title}>
            <span>{t('home.hero.titleLine1')}</span>{' '}
            <span className={styles.titleAccent}>{t('home.hero.titleLine2')}</span>
          </h1>
          <p className={styles.subtitle}>{t('home.hero.subtitle')}</p>

          <div className={styles.responseChip}>
            <span className={styles.responseIcon} aria-hidden="true">
              <Timer size={20} />
            </span>
            <span>
              <strong>{t('home.hero.responseTitle')}</strong>
              <span className={styles.responseBody}>{t('home.hero.responseBody')}</span>
            </span>
          </div>
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <h2 id="steps-title" className={styles.stepsTitle}>
            {t('home.steps.title')}
          </h2>
          <ol className={styles.stepList} role="list">
            {STEPS.map((key, index) => (
              <li key={key} className={styles.step} style={{ '--step-delay': `${index * 80}ms` }}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.stepText}>
                  <span className={styles.stepTitle}>{t(`home.steps.${key}.title`)}</span>
                  <span className={styles.stepBody}>{t(`home.steps.${key}.body`)}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={styles.foundation}>
        <p className={styles.notice}>
          <Info size={18} aria-hidden="true" />
          {t('home.foundationNotice')}
        </p>
        <SystemStatusCard />
      </section>
    </div>
  );
}
