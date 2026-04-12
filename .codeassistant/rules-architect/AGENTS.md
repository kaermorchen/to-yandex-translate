# Project Architecture Rules (Non-Obvious Only)

- Extension follows Manifest V3 – background script is a service worker (`src/context_menu.js`)
- Service worker must be an ES module (`"type": "module"` in manifest) – no CommonJS
- Architecture is minimal: context menu → storage → window/tab creation
- No internal messaging (no content scripts, no message passing) – all logic in service worker
- Domain mapping is static; adding new languages requires code change (no configuration)
- Storage schema is fixed: three keys (`window_width`, `window_height`, `target`) – do not change without migration
- Options page is a separate HTML file with no framework – keep it simple to avoid compatibility issues
- Firefox and Chrome share the same codebase – use only cross‑browser WebExtensions APIs
- No build pipeline – architecture must remain static‑file friendly
- Extension is stateless besides storage; no caching of translations or network requests
