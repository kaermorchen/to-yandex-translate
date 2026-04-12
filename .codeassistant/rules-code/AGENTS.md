# Project Coding Rules (Non-Obvious Only)

- Always use `domainLocales` Map from `src/context_menu.js` for Yandex domain mapping (en→com, ru→ru)
- Language detection must use `chrome.i18n.getAcceptLanguages()` to pick domain, not for UI language
- Settings must be retrieved with default values: `window_width: 900`, `window_height: 650`, `target: "window"`
- Opening translation: use `chrome.windows.create` for popup window, `chrome.tabs.create` for new tab based on `target` setting
- Context menu ID is `"yandex-translate"` – do not change it
- UI strings must be added to both `_locales/en/messages.json` and `_locales/ru/messages.json`
- Options page uses `data-locale` attributes and `src/localize_html.js` for localization – follow existing pattern
- No build system – extension is loaded unpacked; changes to manifest or locales require extension reload
- Service worker is `src/context_menu.js` (background script) – keep it as ES module (`"type": "module"` in manifest)
- Firefox support requires `browser_specific_settings.gecko.id` and `strict_min_version "121.0a1"`
