const contextMenuId = "yandex-translate";

const domainLocales = new Map([
  ["en", "com"],
  ["ru", "ru"],
]);

/**
 * Open translation for the given text
 * @param {string} text - Text to translate
 * @param {Object} [options] - Optional parameters
 * @param {number} [options.x] - X coordinate (for positioning)
 * @param {number} [options.y] - Y coordinate (for positioning)
 */
async function openTranslation(text, options = {}) {
  if (!text || typeof text !== "string") {
    return;
  }

  const gettingAcceptLanguages = await chrome.i18n.getAcceptLanguages();

  const supportedLanguage =
    gettingAcceptLanguages.find((item) => domainLocales.has(item)) || "en";

  const domainLocale = domainLocales.get(supportedLanguage);
  const url = `https://translate.yandex.${domainLocale}/?text=${encodeURIComponent(text)}`;

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
    // Ensure integer dimensions
    const w = Math.round(settings.window_width);
    const h = Math.round(settings.window_height);

    const createData = {
      url: url,
      type: "popup",
      width: w,
      height: h,
    };

    chrome.windows.create(createData);
  }
}

async function lookUpYandexTranslate(info) {
  if (!info || info.menuItemId !== contextMenuId) {
    return;
  }

  await openTranslation(info.selectionText);
}

function init() {
  chrome.contextMenus.create({
    id: contextMenuId,
    title: "Yandex Translate: %s",
    contexts: ["selection"],
  });
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translateSelection") {
    openTranslation(message.text, { x: message.x, y: message.y });
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});

chrome.runtime.onInstalled.addListener(init);
chrome.contextMenus.onClicked.addListener(lookUpYandexTranslate);
