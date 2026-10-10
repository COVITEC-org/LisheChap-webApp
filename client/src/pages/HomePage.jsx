import { SystemStatusCard } from '../components/SystemStatusCard.jsx';
import { useTranslation } from '../lib/i18n/useTranslation.js';

// Phase 1 foundation page. The full discovery homepage is built in Phase 5.
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="page page--home">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">{t('home.hero.title')}</h1>
        <p className="hero__subtitle">{t('home.hero.subtitle')}</p>
        <p className="hero__notice">{t('home.foundationNotice')}</p>
      </section>

      <SystemStatusCard />
    </div>
  );
}
