const contextMenuId = "yandex-translate";

const domainLocales = new Map([
  ["en", "com"],
  ["ru", "ru"],
]);

async function lookUpYandexTranslate(info) {
  if (!info || info.menuItemId !== contextMenuId) {
    return;
  }

  const gettingAcceptLanguages = await chrome.i18n.getAcceptLanguages();

  const supportedLanguage =
    gettingAcceptLanguages.find((item) => domainLocales.has(item)) || "en";

  const domainLocale = domainLocales.get(supportedLanguage);
  const url = `https://translate.yandex.${domainLocale}/?text=${info.selectionText}`;

  const settings = await chrome.storage.sync.get({
    window_height: 650,
    window_width: 900,
    target: "window",
  });

  if (settings.target === "tab") {
    chrome.tabs.create({
      url: url,
    });
  } else {
    const w = settings.window_width;
    const h = settings.window_height;

    chrome.windows.create({
      url: url,
      type: "popup",
      width: w,
      height: h,
    });
  }
}

function init() {
  chrome.contextMenus.create({
    id: contextMenuId,
    title: "Yandex Translate: %s",
    contexts: ["selection"],
  });
}

chrome.runtime.onInstalled.addListener(init);
chrome.contextMenus.onClicked.addListener(lookUpYandexTranslate);
