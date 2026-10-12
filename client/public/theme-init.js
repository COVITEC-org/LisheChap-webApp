// Applies the saved or system theme before React renders, preventing a flash
// of the wrong theme. Loaded synchronously from index.html (external file so it
// works with the production Content Security Policy).
// Keep STORAGE_KEY in sync with src/lib/theme/themeConfig.js.
(function () {
  var STORAGE_KEY = 'lishechap.theme';
  var preference = 'system';
  try {
    preference = window.localStorage.getItem(STORAGE_KEY) || 'system';
  } catch (error) {
    preference = 'system';
  }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDark = preference === 'dark' || (preference !== 'light' && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
})();
