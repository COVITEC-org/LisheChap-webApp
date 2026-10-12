// Payment methods shown to customers. Codes match the server-side
// PaymentProvider adapters (Phase 8). This list is display configuration only:
// no payment is initiated from the client and no provider API is faked here.

import airtelMoneyLogo from '../assets/mobile-payments-logo/airtel-money-logo.png';
import halopesaLogo from '../assets/mobile-payments-logo/halopesa-logo.png';
import mpesaLogo from '../assets/mobile-payments-logo/m-pesa-logo.png';
import mixxByYasLogo from '../assets/mobile-payments-logo/Mixx_by_Yas-logo.jpg';

export const PAYMENT_METHOD_TYPES = {
  MOBILE_MONEY: 'MOBILE_MONEY',
  BANK: 'BANK',
};

/**
 * logoFit: 'contain' shows the whole supplied logo (never cropped); 'cover' fills
 * the tile and is only for logos with generous padding. Banks without a supplied
 * logo render a neutral name tile instead of an invented mark.
 */
export const PAYMENT_METHODS = [
  { code: 'MPESA', name: 'M-Pesa', type: PAYMENT_METHOD_TYPES.MOBILE_MONEY, logo: mpesaLogo, logoFit: 'contain' },
  {
    code: 'AIRTEL_MONEY',
    name: 'Airtel Money',
    type: PAYMENT_METHOD_TYPES.MOBILE_MONEY,
    logo: airtelMoneyLogo,
    logoFit: 'contain',
  },
  {
    code: 'MIXX_BY_YAS',
    name: 'Mixx by Yas',
    type: PAYMENT_METHOD_TYPES.MOBILE_MONEY,
    logo: mixxByYasLogo,
    logoFit: 'contain',
  },
  { code: 'HALOPESA', name: 'HaloPesa', type: PAYMENT_METHOD_TYPES.MOBILE_MONEY, logo: halopesaLogo, logoFit: 'contain' },
  { code: 'CRDB', name: 'CRDB', type: PAYMENT_METHOD_TYPES.BANK, logo: null },
  { code: 'NMB', name: 'NMB', type: PAYMENT_METHOD_TYPES.BANK, logo: null },
];
