import { describe, expect, it } from 'vitest';
import { formatDistance, formatRating, formatTSh } from './format.js';

describe('formatTSh', () => {
  it('formats whole shillings with thousands separators', () => {
    expect(formatTSh(7000)).toBe('TSh 7,000');
    expect(formatTSh(2050)).toBe('TSh 2,050');
    expect(formatTSh(0)).toBe('TSh 0');
    expect(formatTSh(1250000)).toBe('TSh 1,250,000');
  });

  it('returns an empty string for invalid amounts', () => {
    expect(formatTSh(undefined)).toBe('');
    expect(formatTSh(Number.NaN)).toBe('');
  });
});

describe('formatDistance', () => {
  it('uses metres below 1 km, rounded to 10 m', () => {
    expect(formatDistance(0.85)).toBe('850 m');
    expect(formatDistance(0.004)).toBe('10 m');
  });

  it('uses one decimal below 10 km and whole km above', () => {
    expect(formatDistance(2.14)).toBe('2.1 km');
    expect(formatDistance(12.6)).toBe('13 km');
  });

  it('rejects invalid distances', () => {
    expect(formatDistance(-1)).toBe('');
  });
});

describe('formatRating', () => {
  it('shows one decimal', () => {
    expect(formatRating(4.56)).toBe('4.6');
    expect(formatRating(4)).toBe('4.0');
  });
});
