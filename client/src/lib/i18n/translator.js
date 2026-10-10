const INTERPOLATION_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages);
}

function interpolate(template, values) {
  if (!values) return template;
  return template.replace(INTERPOLATION_PATTERN, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
  );
}

/**
 * Builds a translate function for one locale.
 * Keys are dot paths ("home.hero.title"). Missing keys fall back to the
 * fallback locale, then to the key itself so gaps are visible, never blank.
 */
export function createTranslator(messages, fallbackMessages = {}) {
  return function t(key, values) {
    const message = lookup(messages, key) ?? lookup(fallbackMessages, key);
    return typeof message === 'string' ? interpolate(message, values) : key;
  };
}
