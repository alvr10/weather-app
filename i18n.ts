module.exports = {
    locales: ["en", "pt", "es"],
    defaultLocale: "en",
    localeDetection: true,
    loadLocaleFrom: (lang: string, ns: string) =>
      import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
  };
  