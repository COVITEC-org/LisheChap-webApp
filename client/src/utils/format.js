// Display formatting only. Prices are integers in Tanzanian Shillings and are
// always calculated by the server; the client never computes totals or fees.

const groupedNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 7000 -> "TSh 7,000" */
export function formatTSh(amount) {
  if (!Number.isFinite(amount)) return '';
  return `TSh ${groupedNumber.format(Math.round(amount))}`;
}

/** 0.85 -> "850 m", 2.14 -> "2.1 km", 12.6 -> "13 km" */
export function formatDistance(km) {
  if (!Number.isFinite(km) || km < 0) return '';
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  if (km < 10) return `${oneDecimal.format(km)} km`;
  return `${groupedNumber.format(Math.round(km))} km`;
}

/** 4.56 -> "4.6" */
export function formatRating(value) {
  if (!Number.isFinite(value)) return '';
  return oneDecimal.format(value);
}
