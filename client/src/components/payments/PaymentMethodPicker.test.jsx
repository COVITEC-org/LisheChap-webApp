import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PAYMENT_METHODS } from '../../constants/paymentMethods.js';
import { renderWithProviders, stubMatchMedia } from '../../test/renderWithProviders.jsx';
import { PaymentMethodPicker } from './PaymentMethodPicker.jsx';

beforeEach(() => {
  stubMatchMedia(false);
});

describe('PaymentMethodPicker', () => {
  it('offers every supported provider as a labelled radio option', () => {
    renderWithProviders(<PaymentMethodPicker label="Chagua njia ya malipo" value="" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Chagua njia ya malipo' })).toBeInTheDocument();
    for (const name of ['M-Pesa', 'Airtel Money', 'Mixx by Yas', 'HaloPesa', 'CRDB', 'NMB']) {
      expect(screen.getByRole('radio', { name: new RegExp(name) })).toBeInTheDocument();
    }
  });

  it('uses the supplied logos for the mobile money providers only', () => {
    const withLogo = PAYMENT_METHODS.filter((method) => method.logo).map((method) => method.code);
    expect(withLogo).toEqual(['MPESA', 'AIRTEL_MONEY', 'MIXX_BY_YAS', 'HALOPESA']);
  });

  it('reports the chosen method code', () => {
    const onChange = vi.fn();
    renderWithProviders(<PaymentMethodPicker label="Malipo" value="MPESA" onChange={onChange} />);

    expect(screen.getByRole('radio', { name: /M-Pesa/ })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: /HaloPesa/ }));
    expect(onChange).toHaveBeenCalledWith('HALOPESA');
  });

  it('shows unavailable providers but prevents selecting them', () => {
    renderWithProviders(
      <PaymentMethodPicker label="Malipo" value="MPESA" onChange={vi.fn()} unavailableCodes={['NMB']} />,
    );
    expect(screen.getByRole('radio', { name: /NMB/ })).toBeDisabled();
  });
});
