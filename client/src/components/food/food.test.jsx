import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubMatchMedia } from '../../test/renderWithProviders.jsx';
import { CategoryChip } from './CategoryChip.jsx';
import { FoodCard } from './FoodCard.jsx';
import { RestaurantCard } from './RestaurantCard.jsx';

const RESTAURANT = {
  name: 'Mama Asha Kitchen',
  rating: 4.7,
  reviewCount: 128,
  distanceKm: 2.14,
  locationLabel: 'Sinza, Dar es Salaam',
  prepTimeMinutes: [10, 15],
  isOpen: true,
  isChefActive: true,
  hasDelivery: true,
};

beforeEach(() => {
  stubMatchMedia(false);
});

describe('RestaurantCard', () => {
  it('shows the restaurant facts in Swahili', () => {
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} food={{ name: 'Chipsi Kuku', price: 7000 }} />);
    const card = screen.getByRole('article');

    expect(within(card).getByRole('heading', { name: 'Mama Asha Kitchen' })).toBeInTheDocument();
    expect(within(card).getByText('Wazi')).toBeInTheDocument();
    expect(within(card).getByText('2.1 km')).toBeInTheDocument();
    expect(within(card).getByText('TSh 7,000')).toBeInTheDocument();
    expect(within(card).getByText('Mpishi yupo mtandaoni')).toBeInTheDocument();
    expect(within(card).getByText('Uwasilishaji upo')).toBeInTheDocument();
    expect(within(card).getByRole('img', { name: /Ukadiriaji 4.7 kati ya 5, maoni 128/ })).toBeInTheDocument();
  });

  it('never claims the food is confirmed without a KIPO response', () => {
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} />);
    expect(screen.queryByText('KIPO')).not.toBeInTheDocument();
  });

  it('shows the live confirmation status when provided', () => {
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} availabilityStatus="KIPO" />);
    expect(screen.getByText('KIPO')).toBeInTheDocument();
  });

  it('renders no verify button unless a real handler is supplied', () => {
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} />);
    expect(screen.queryByRole('button', { name: 'Thibitisha Chakula' })).not.toBeInTheDocument();
  });

  it('calls the verify handler for an active restaurant', () => {
    const onVerify = vi.fn();
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} onVerify={onVerify} />);

    fireEvent.click(screen.getByRole('button', { name: 'Thibitisha Chakula' }));

    expect(onVerify).toHaveBeenCalledOnce();
  });

  it('disables verification and explains why when the restaurant cannot respond', () => {
    renderWithProviders(
      <RestaurantCard restaurant={{ ...RESTAURANT, isOpen: false, isChefActive: false }} onVerify={vi.fn()} />,
    );
    const button = screen.getByRole('button', { name: 'Thibitisha Chakula' });

    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription('Mgahawa huu hauwezi kujibu kwa sasa.');
    expect(screen.getByText('Imefungwa')).toBeInTheDocument();
    expect(screen.getByText('Mpishi hayupo mtandaoni')).toBeInTheDocument();
  });

  it('links the whole card to the restaurant page when href is given', () => {
    renderWithProviders(<RestaurantCard restaurant={RESTAURANT} href="/migahawa/mama-asha" />);
    expect(screen.getByRole('link', { name: 'Mama Asha Kitchen' })).toHaveAttribute('href', '/migahawa/mama-asha');
  });
});

describe('FoodCard', () => {
  const FOOD = { name: 'Pilau ya Nyama', description: 'Pilau tamu', price: 6000, status: 'AVAILABLE' };

  it('shows name, price and menu status', () => {
    renderWithProviders(<FoodCard food={FOOD} />);
    expect(screen.getByRole('heading', { name: 'Pilau ya Nyama' })).toBeInTheDocument();
    expect(screen.getByText('TSh 6,000')).toBeInTheDocument();
    expect(screen.getByText('Kwenye menyu')).toBeInTheDocument();
  });

  it('disables the action for unavailable food', () => {
    renderWithProviders(
      <FoodCard food={{ ...FOOD, status: 'UNAVAILABLE' }} onSelect={vi.fn()} actionLabel="Tafuta migahawa" />,
    );
    expect(screen.getByRole('button', { name: 'Tafuta migahawa' })).toBeDisabled();
    expect(screen.getByText('Haipatikani kwa sasa')).toBeInTheDocument();
  });
});

describe('CategoryChip', () => {
  it('exposes its selected state', () => {
    const onClick = vi.fn();
    renderWithProviders(<CategoryChip label="Pizza" selected onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'Pizza' });

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
