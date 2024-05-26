browser.contextMenus.create({
  title: "Yandex Translate: %s",
  contexts: ["selection"],
  onclick: lookUpYandexTranslate,
});

const domainLocales = new Map([
  ["en", "com"],
  ["ru", "ru"],
]);

async function lookUpYandexTranslate(info) {
  if (!info) {
    return;
  }

  const gettingAcceptLanguages = await browser.i18n.getAcceptLanguages();

  const supportedLanguage =
    gettingAcceptLanguages.find((item) => domainLocales.has(item)) || "en";

  const domainLocale = domainLocales.get(supportedLanguage);
  const url = `https://translate.yandex.${domainLocale}/?text=${info.selectionText}`;

  const settings = await browser.storage.sync.get({
    window_height: 650,
    window_width: 900,
    target: "window",
  });

  if (settings.target === "tab") {
    browser.tabs.create({
      url: url,
    });
  } else {
    const w = settings.window_width;
    const h = settings.window_height;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    browser.windows.create({
      url: url,
      type: "popup",
      width: w,
      height: h,
      left: left,
      top: top,
    });
  }
}
