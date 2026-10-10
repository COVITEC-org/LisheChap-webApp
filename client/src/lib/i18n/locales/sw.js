// Kiswahili (Tanzania): the primary LisheChap locale.
// All customer-facing text lives here. Add matching keys in other locale files
// (for example en.js) to support more languages without touching components.
const sw = {
  common: {
    appName: 'LisheChap',
    home: 'Nyumbani',
    retry: 'Jaribu tena',
    loading: 'Inapakia...',
  },
  nav: {
    mainLabel: 'Urambazaji mkuu',
  },
  home: {
    hero: {
      title: 'Chakula unachotaka, karibu nawe.',
      subtitle:
        'Tafuta chakula, thibitisha kama kipo kwenye mgahawa ulio karibu, kisha agiza au elekea mgahawani bila kupoteza muda.',
    },
    foundationNotice:
      'Msingi wa mfumo umewekwa. Huduma za kutafuta, kuthibitisha na kuagiza chakula zinaongezwa hatua kwa hatua.',
  },
  systemStatus: {
    title: 'Hali ya mfumo',
    api: 'Seva (API)',
    database: 'Hifadhidata',
    checking: 'Inakagua...',
    up: 'Inafanya kazi',
    down: 'Haipatikani',
    unreachable: 'Imeshindikana kuwasiliana na seva. Hakikisha seva inafanya kazi kisha ujaribu tena.',
    checkAgain: 'Kagua tena',
    lastChecked: 'Imekaguliwa saa {{time}}',
  },
  notFound: {
    title: 'Ukurasa haupatikani',
    description: 'Ukurasa unaoutafuta haupo au umehamishwa.',
    backHome: 'Rudi nyumbani',
  },
};

export default sw;
