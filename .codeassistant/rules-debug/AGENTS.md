# Project Debug Rules (Non-Obvious Only)

- No built-in debugging tools – use browser's extension developer tools
- Service worker logs appear in "Service Worker" console (Chrome) or "Background Script" console (Firefox)
- Changes to manifest.json or locale files require a full extension reload
- No hot reload – manually reload the unpacked extension after code changes
- To test context menu: select text on any page, right‑click, choose "Yandex Translate: ..."
- Options page can be opened via `chrome://extensions` → details → "Extension options"
- Storage values can be inspected in browser's storage viewer (`chrome.storage.sync`)
- Firefox debugging: use "Debug Add‑ons" in `about:debugging`
