# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

- Browser extension (Manifest V3) for Firefox and Chrome
- No build system (no package.json, no npm scripts)
- Uses ES modules (`"type": "module"` in manifest)

## Non-Obvious Discoveries

### Domain Mapping

- Yandex Translate domains are mapped by language: `en` → `com`, `ru` → `ru` (see `domainLocales` Map in `src/context_menu.js`)
- Language detection uses `chrome.i18n.getAcceptLanguages()` to pick domain, not for UI language

### Storage & Settings

- Settings stored in `chrome.storage.sync` with keys: `window_width`, `window_height`, `target`
- Default values: width=900, height=650, target="window"
- Options page (`src/options.html`) uses `data-locale` attributes and `src/localize_html.js` for localization

### Internationalization

- Locale files in `_locales/{lang}/messages.json`
- UI strings must be added to both English and Russian locale files
- The extension name and description are also localized via `__MSG_*__` in manifest

### Browser Support

- Firefox: `gecko` and `gecko_android` with strict_min_version "121.0a1"
- Chrome: minimum_chrome_version "121"
- Uses `browser_specific_settings` for Firefox add‑on ID

### Code Patterns

- Service worker is `src/context_menu.js` (background script)
- Context menu ID is `"yandex-translate"`
- Opening translation: popup window (default) or new tab based on `target` setting
- URL format: `https://translate.yandex.{domain}/?text={selectionText}`

## Testing & Development

- No test framework configured
- To test: load unpacked extension in browser developer mode
- Changes to manifest or locales require extension reload
