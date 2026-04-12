# Project Documentation Rules (Non-Obvious Only)

- Extension uses two separate localization systems:
  1. Manifest strings via `__MSG_*__` (extension name/description)
  2. Options page UI via `data-locale` attributes and `src/localize_html.js`
- Firefox support is explicit: requires `browser_specific_settings.gecko.id` and `gecko_android`
- Context menu is created once on installation (`chrome.runtime.onInstalled`)
- The `%s` in context menu title is automatically replaced with selected text
- Domain mapping is hardcoded; adding new languages requires updating `domainLocales` Map
- No build process – all files are static; just load the folder as unpacked extension
- Options page is a simple HTML form; styling is in `src/options.css`
- The service worker (`src/context_menu.js`) is an ES module – keep `"type": "module"` in manifest
