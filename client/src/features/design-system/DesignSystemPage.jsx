// DEVELOPMENT-ONLY reference page for the LisheChap design system.
// Registered as a route only when import.meta.env.DEV is true (see routes.jsx).

import {
  ArrowRight,
  CircleCheck,
  CircleX,
  Filter,
  FlaskConical,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Logo, LogoMark } from '../../components/brand/Logo.jsx';
import { FoodCardSkeleton, RestaurantCardSkeleton } from '../../components/food/CardSkeletons.jsx';
import { CategoryChip, CategoryRail } from '../../components/food/CategoryChip.jsx';
import { FoodCard } from '../../components/food/FoodCard.jsx';
import { RestaurantCard } from '../../components/food/RestaurantCard.jsx';
import { ThemeSwitcher } from '../../components/navigation/ThemeControls.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Drawer } from '../../components/ui/Drawer.jsx';
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field.jsx';
import { IconButton } from '../../components/ui/IconButton.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { SectionHeader } from '../../components/ui/SectionHeader.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { EmptyState, ErrorState } from '../../components/ui/StateMessage.jsx';
import { useTranslation } from '../../lib/i18n/useTranslation.js';
import { SAMPLE_CATEGORIES, SAMPLE_FOODS, SAMPLE_RESTAURANTS } from './sampleData.js';
import styles from './DesignSystemPage.module.css';

const COLOR_GROUPS = [
  ['--primary', '--primary-hover', '--primary-dark', '--primary-bright', '--primary-soft', '--secondary'],
  ['--background', '--surface', '--surface-muted', '--surface-elevated', '--border', '--border-strong'],
  ['--text', '--text-muted', '--text-subtle', '--success', '--warning', '--danger', '--info'],
];

const TYPE_SCALE = ['--text-4xl', '--text-3xl', '--text-2xl', '--text-xl', '--text-lg', '--text-base', '--text-sm'];

const REGIONS = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Zanzibar'].map((name) => ({
  value: name,
  label: name,
}));

function Section({ id, title, children }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <SectionHeader id={id} title={title} />
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const { t } = useTranslation();
  const s = (key, values) => t(`designSystem.samples.${key}`, values);

  const [selectedCategory, setSelectedCategory] = useState('chips');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const selectedLabel = SAMPLE_CATEGORIES.find((category) => category.id === selectedCategory)?.label;

  function simulateSend() {
    setSending(true);
    window.setTimeout(() => setSending(false), 1500);
  }

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.intro}>
        <div className={styles.introBadges}>
          <Badge tone="warning" icon={FlaskConical}>
            {t('designSystem.devOnly')}
          </Badge>
        </div>
        <h1 className={styles.title}>{t('designSystem.title')}</h1>
        <p className={styles.lead}>{t('designSystem.subtitle')}</p>
        <div className={styles.introControls}>
          <ThemeSwitcher />
        </div>
        <p className={styles.sampleNotice}>{t('designSystem.sampleNotice')}</p>
      </header>

      <Section id="ds-brand" title={t('designSystem.sections.brand')}>
        <div className={styles.brandRow}>
          <Card className={styles.brandTile}>
            <Logo size={48} />
          </Card>
          <Card className={styles.brandTile}>
            <LogoMark size={64} />
          </Card>
          <Card className={`${styles.brandTile} ${styles.brandTileInverse}`}>
            <LogoMark size={32} />
            <LogoMark size={24} />
            <LogoMark size={16} />
          </Card>
        </div>
      </Section>

      <Section id="ds-colors" title={t('designSystem.sections.colors')}>
        <div className={styles.colorGroups}>
          {COLOR_GROUPS.map((group) => (
            <ul key={group[0]} className={styles.swatches} role="list">
              {group.map((token) => (
                <li key={token} className={styles.swatch}>
                  <span className={styles.swatchColor} style={{ background: `var(${token})` }} />
                  <code className={styles.swatchName}>{token}</code>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Section>

      <Section id="ds-type" title={t('designSystem.sections.typography')}>
        <Card padding="lg" className={styles.typeCard}>
          {TYPE_SCALE.map((token, index) => (
            <div key={token} className={styles.typeRow}>
              <code className={styles.typeToken}>{token}</code>
              <span
                className={index < 4 ? styles.typeDisplay : styles.typeBody}
                style={{ fontSize: `var(${token})` }}
              >
                {index < 4 ? s('displayHeading') : s('bodyText')}
              </span>
            </div>
          ))}
        </Card>
      </Section>

      <Section id="ds-buttons" title={t('designSystem.sections.buttons')}>
        <div className={styles.stackLg}>
          <div className="cluster">
            <Button iconStart={ShoppingBag}>{s('buttonPrimary')}</Button>
            <Button variant="secondary" iconStart={Search}>
              {s('buttonSecondary')}
            </Button>
            <Button variant="outline" iconStart={Navigation}>
              {s('buttonOutline')}
            </Button>
            <Button variant="ghost">{s('buttonGhost')}</Button>
          </div>
          <div className="cluster">
            <Button variant="success" size="lg" iconStart={CircleCheck}>
              {s('buttonKipo')}
            </Button>
            <Button variant="danger" size="lg" iconStart={CircleX}>
              {s('buttonHakipo')}
            </Button>
            <Button loading={sending} onClick={simulateSend} iconEnd={ArrowRight}>
              {sending ? s('buttonLoading') : s('buttonPrimary')}
            </Button>
            <Button disabled>{s('buttonDisabled')}</Button>
          </div>
          <div className="cluster">
            <Button size="sm">{s('buttonPrimary')}</Button>
            <Button size="md">{s('buttonPrimary')}</Button>
            <Button size="lg">{s('buttonPrimary')}</Button>
            <IconButton icon={Phone} label={s('phoneLabel')} variant="soft" />
            <IconButton icon={MapPin} label={s('buttonOutline')} variant="solid" />
            <IconButton icon={SlidersHorizontal} label={s('drawerTitle')} variant="ghost" badge={3} />
          </div>
        </div>
      </Section>

      <Section id="ds-inputs" title={t('designSystem.sections.inputs')}>
        <Card padding="lg">
          <div className={styles.formGrid}>
            <TextField
              className={styles.spanAll}
              label={s('searchLabel')}
              placeholder={s('searchPlaceholder')}
              iconStart={Search}
              type="search"
              size="lg"
            />
            <TextField label={s('phoneLabel')} type="tel" inputMode="tel" hint={s('phoneHint')} required />
            <TextField
              label={s('phoneLabel')}
              type="tel"
              defaultValue="0712"
              error={s('phoneError')}
              required
            />
            <SelectField
              label={s('regionLabel')}
              placeholder={s('regionPlaceholder')}
              options={REGIONS}
              defaultValue=""
            />
            <TextField label={s('buttonDisabled')} disabled defaultValue="Sinza, Dar es Salaam" />
            <TextAreaField className={styles.spanAll} label={s('noteLabel')} placeholder={s('notePlaceholder')} />
          </div>
        </Card>
      </Section>

      <Section id="ds-badges" title={t('designSystem.sections.badges')}>
        <div className={styles.stackLg}>
          <div className="cluster">
            <Badge tone="success" dot>
              {t('restaurant.open')}
            </Badge>
            <Badge tone="neutral" dot>
              {t('restaurant.closed')}
            </Badge>
            <Badge tone="success" dot pulse>
              {t('restaurant.chefActive')}
            </Badge>
            <Badge tone="primary" icon={Sparkles}>
              {t('food.featured')}
            </Badge>
            <Badge tone="info">{t('restaurant.deliveryAvailable')}</Badge>
          </div>
          <div className="cluster">
            {['PENDING', 'KIPO', 'HAKIPO', 'EXPIRED'].map((status) => (
              <Badge
                key={status}
                tone={{ PENDING: 'warning', KIPO: 'success', HAKIPO: 'danger', EXPIRED: 'neutral' }[status]}
                variant={status === 'KIPO' ? 'solid' : 'soft'}
                dot={status === 'PENDING'}
                pulse={status === 'PENDING'}
              >
                {t(`availability.status.${status}`)}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      <Section id="ds-cards" title={t('designSystem.sections.cards')}>
        <div className="card-grid">
          {[
            ['default', 'cardDefault'],
            ['elevated', 'cardElevated'],
            ['muted', 'cardMuted'],
          ].map(([variant, key]) => (
            <Card key={variant} variant={variant} interactive={variant === 'default'}>
              <h3 className={styles.cardTitle}>{s(key)}</h3>
              <p className="text-muted">{s('cardBody')}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="ds-glass" title={t('designSystem.sections.glass')}>
        <div className={styles.glassStage}>
          <Card variant="glass" padding="lg" className={styles.glassCard}>
            <Badge tone="primary" icon={Sparkles}>
              LisheChap
            </Badge>
            <h3 className={styles.glassTitle}>{s('glassTitle')}</h3>
            <p>{s('glassBody')}</p>
            <TextField
              label={s('searchLabel')}
              hideLabel
              placeholder={s('searchPlaceholder')}
              iconStart={Search}
              type="search"
            />
          </Card>
        </div>
      </Section>

      <Section id="ds-categories" title={t('designSystem.sections.categories')}>
        <CategoryRail label={t('designSystem.sections.categories')}>
          {SAMPLE_CATEGORIES.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.label}
              icon={category.icon}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </CategoryRail>
        <p className={styles.feedback} aria-live="polite">
          {s('chosenCategory', { name: selectedLabel })}
        </p>
      </Section>

      <Section id="ds-restaurants" title={t('designSystem.sections.restaurants')}>
        <div className="card-grid" style={{ '--card-min': '280px' }}>
          {SAMPLE_RESTAURANTS.map(({ food, availabilityStatus, ...restaurant }) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              food={food}
              availabilityStatus={availabilityStatus}
              onVerify={() => setLastAction(s('verifyClicked', { name: restaurant.name }))}
            />
          ))}
        </div>
        <p className={styles.feedback} aria-live="polite">
          {lastAction}
        </p>
      </Section>

      <Section id="ds-foods" title={t('designSystem.sections.foods')}>
        <div className="card-grid" style={{ '--card-min': '240px' }}>
          {SAMPLE_FOODS.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              actionLabel={s('findRestaurants')}
              onSelect={() => setLastAction(s('foodSelected', { name: food.name }))}
            />
          ))}
        </div>
      </Section>

      <Section id="ds-states" title={t('designSystem.sections.states')}>
        <div className={styles.stackLg}>
          <div className="card-grid" aria-busy="true" style={{ '--card-min': '260px' }}>
            <span className="visually-hidden">{s('loadingLabel')}</span>
            <RestaurantCardSkeleton />
            <FoodCardSkeleton />
            <div className={styles.spinnerTile}>
              <Spinner size={32} label={s('loadingLabel')} />
            </div>
          </div>
          <div className="card-grid" style={{ '--card-min': '320px' }}>
            <EmptyState
              icon={MapPin}
              title={s('emptyTitle')}
              description={s('emptyBody')}
              action={
                <Button variant="secondary" size="sm" iconStart={Filter} onClick={() => setDrawerOpen(true)}>
                  {s('drawerTitle')}
                </Button>
              }
            />
            <ErrorState description={s('errorBody')} onRetry={simulateSend} />
          </div>
          <ErrorState compact title={t('states.offline.title')} description={t('states.offline.description')} />
        </div>
      </Section>

      <Section id="ds-overlays" title={t('designSystem.sections.overlays')}>
        <div className="cluster">
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            {s('openModal')}
          </Button>
          <Button variant="outline" iconStart={SlidersHorizontal} onClick={() => setDrawerOpen(true)}>
            {s('openDrawer')}
          </Button>
        </div>
      </Section>

      <Section id="ds-motion" title={t('designSystem.sections.motion')}>
        <Card className={styles.motionCard}>
          <Badge tone="success" dot pulse>
            {s('motionPulse')}
          </Badge>
          <p className="text-muted">{s('motionNote')}</p>
        </Card>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={s('modalTitle')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button iconStart={CircleCheck} onClick={() => setModalOpen(false)}>
              {s('modalConfirm')}
            </Button>
          </>
        }
      >
        <p>{s('modalBody')}</p>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={s('drawerTitle')}>
        <div className={styles.stackLg}>
          <p className="text-muted">{s('drawerBody')}</p>
          <SelectField label={s('regionLabel')} placeholder={s('regionPlaceholder')} options={REGIONS} defaultValue="" />
        </div>
      </Drawer>
    </div>
  );
}
