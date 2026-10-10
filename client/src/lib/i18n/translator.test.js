import { describe, expect, it } from 'vitest';
import { createTranslator } from './translator.js';

const messages = {
  greeting: 'Karibu {{name}}',
  nested: { label: 'Tafuta' },
};

describe('createTranslator', () => {
  it('resolves dot-path keys', () => {
    expect(createTranslator(messages)('nested.label')).toBe('Tafuta');
  });

  it('interpolates values', () => {
    expect(createTranslator(messages)('greeting', { name: 'Asha' })).toBe('Karibu Asha');
  });

  it('keeps unknown placeholders intact', () => {
    expect(createTranslator(messages)('greeting', {})).toBe('Karibu {{name}}');
  });

  it('falls back to the fallback locale, then the key', () => {
    const t = createTranslator({}, messages);
    expect(t('nested.label')).toBe('Tafuta');
    expect(t('missing.key')).toBe('missing.key');
  });

  it('does not return non-string nodes', () => {
    expect(createTranslator(messages)('nested')).toBe('nested');
  });
});
