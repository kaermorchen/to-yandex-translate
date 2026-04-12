// Content script for Yandex Translate extension
// Shows translation icon when text is selected

(function () {
  "use strict";

  try {
    console.log("[Yandex Translate] Content script starting...");

    // Configuration
    const ICON_SIZE = 32;
    const ICON_MARGIN = 5;
    const ICON_PATH = chrome.runtime.getURL("assets/icons/icon-48.png");

    // State
    let currentIcon = null;
    let currentSelection = "";
    let mouseX = 0;
    let mouseY = 0;
    let showIconTimer = null;
    let suppressIcon = false;
    let suppressTimer = null;
    let settings = {
      show_icon: true,
    };

    // Create icon element
    function createIcon() {
      const icon = document.createElement("img");
      icon.src = ICON_PATH;
      icon.title = chrome.i18n.getMessage("iconTitle") || "Translate";
      icon.style.cssText = `
      position: absolute;
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
      cursor: pointer;
      pointer-events: auto;
      z-index: 10000;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s;
    `;

      icon.addEventListener("mouseenter", () => {
        icon.style.transform = "scale(1.1)";
      });

      icon.addEventListener("mouseleave", () => {
        icon.style.transform = "scale(1)";
      });

      icon.addEventListener("click", handleIconClick);

      // Log image loading errors
      icon.addEventListener("error", (e) => {
        console.error("Failed to load icon from", ICON_PATH, e);
      });

      icon.addEventListener("load", () => {
        console.log("Icon loaded successfully from", ICON_PATH);
      });

      return icon;
    }

    // Handle icon click
    function handleIconClick(event) {
      event.stopPropagation();
      event.preventDefault();

      if (currentSelection.trim()) {
        // Send message to background script to open translation
        chrome.runtime.sendMessage({
          action: "translateSelection",
          text: currentSelection,
          x: mouseX,
          y: mouseY,
        });
      }

      hideIcon();

      // Suppress icon for a short time after click to prevent immediate reappearance
      suppressIcon = true;
      if (suppressTimer) clearTimeout(suppressTimer);
      suppressTimer = setTimeout(() => {
        suppressIcon = false;
        suppressTimer = null;
      }, 500); // 500ms suppression
    }

    // Schedule showing icon with a delay
    function scheduleShowIcon() {
      // Skip if icon is suppressed (e.g., after click)
      if (suppressIcon) {
        console.log("Icon suppressed, skipping show");
        return;
      }

      // Skip if icon is disabled in settings
      if (!settings.show_icon) {
        console.log("Icon disabled in settings, skipping show");
        return;
      }

      // Clear any existing timer
      if (showIconTimer) {
        clearTimeout(showIconTimer);
        showIconTimer = null;
      }

      // Set new timer
      showIconTimer = setTimeout(() => {
        const selectedText = getSelectedText();
        if (!selectedText) {
          // Selection disappeared, don't show icon
          return;
        }
        currentSelection = selectedText;

        const selRect = getSelectionRect();
        console.log(selRect.right, selRect.top, mouseX, mouseY);
        if (selRect) {
          showIcon(selRect.right, selRect.top);
        } else {
          // Fallback to last mouse coordinates
          showIcon(mouseX, mouseY);
        }
        showIconTimer = null;
      }, 150); // 150ms delay
    }

    // Show icon at position
    function showIcon(x, y) {
      console.log("showIcon called with", x, y);
      hideIcon();

      currentIcon = createIcon();
      console.log("icon created", currentIcon);
      document.body.appendChild(currentIcon);
      console.log("icon appended to body");

      // Position icon near mouse or selection
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Coordinates relative to viewport
      let viewportX = x + ICON_MARGIN;
      let viewportY = y - ICON_SIZE - ICON_MARGIN;

      // Adjust if icon goes out of viewport
      if (viewportX + ICON_SIZE > viewportWidth) {
        viewportX = x - ICON_SIZE - ICON_MARGIN;
      }
      if (viewportY < 0) {
        viewportY = y + ICON_MARGIN;
      }

      // Convert to document coordinates
      const posX = viewportX + scrollX;
      const posY = viewportY + scrollY;

      console.log(
        "positioning icon at",
        posX,
        posY,
        "(viewport:",
        viewportX,
        viewportY,
        ")",
      );
      currentIcon.style.left = `${posX}px`;
      currentIcon.style.top = `${posY}px`;
    }

    // Hide icon
    function hideIcon() {
      if (currentIcon && document.body.contains(currentIcon)) {
        currentIcon.remove();
      }
      currentIcon = null;

      // Clear any pending show timer
      if (showIconTimer) {
        clearTimeout(showIconTimer);
        showIconTimer = null;
      }
    }

    // Load settings from storage
    function loadSettings() {
      chrome.storage.sync.get(
        {
          show_icon: true,
        },
        (result) => {
          settings.show_icon = result.show_icon;
          console.log("Settings loaded:", settings);
        },
      );
    }

    // Get selected text
    function getSelectedText() {
      return window.getSelection().toString().trim();
    }

    // Get bounding rectangle of selection
    function getSelectionRect() {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return null;

      const range = selection.getRangeAt(0);
      return range.getBoundingClientRect();
    }

    // Handle mouse up (selection end)
    function handleMouseUp(event) {
      console.log("mouseup event", event.clientX, event.clientY);
      // Small delay to allow selection to update
      setTimeout(() => {
        const selectedText = getSelectedText();
        console.log("selectedText:", selectedText);

        if (selectedText && selectedText.length > 0) {
          // Skip if icon is suppressed (e.g., after click)
          if (suppressIcon) {
            console.log("Icon suppressed, skipping show after mouseup");
            return;
          }

          // Skip if icon is disabled in settings
          if (!settings.show_icon) {
            console.log(
              "Icon disabled in settings, skipping show after mouseup",
            );
            return;
          }

          currentSelection = selectedText;

          // Try to get selection rectangle for better positioning
          const selRect = getSelectionRect();
          if (selRect) {
            mouseX = selRect.right;
            mouseY = selRect.top;
            console.log("using selection rect", selRect);
          } else {
            mouseX = event.clientX;
            mouseY = event.clientY;
          }

          console.log("showing icon at", mouseX, mouseY);
          scheduleShowIcon();
        } else {
          console.log("no selection, hiding icon");
          hideIcon();
        }
      }, 10);
    }

    // Handle click outside
    function handleClickOutside(event) {
      if (currentIcon && !currentIcon.contains(event.target)) {
        hideIcon();
      }
    }

    // Handle scroll
    function handleScroll() {
      if (currentIcon) {
        hideIcon();
      }
    }

    // Initialize
    function init() {
      // Load settings
      loadSettings();

      // Listen for storage changes to update settings
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "sync") {
          if (changes.show_icon) {
            settings.show_icon = changes.show_icon.newValue;
            console.log("Settings updated:", settings);
          }
        }
      });

      // Listen for selection events
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("scroll", handleScroll);

      // Also listen for selectionchange for better responsiveness
      document.addEventListener("selectionchange", () => {
        const selectedText = getSelectedText();
        if (selectedText && selectedText.length > 0) {
          // Skip if icon is suppressed (e.g., after click)
          if (suppressIcon) {
            console.log("Icon suppressed, skipping show after selectionchange");
            return;
          }
          // Skip if icon is disabled in settings
          if (!settings.show_icon) {
            console.log(
              "Icon disabled in settings, skipping show after selectionchange",
            );
            return;
          }
          currentSelection = selectedText;
          const selRect = getSelectionRect();
          if (selRect) {
            mouseX = selRect.right;
            mouseY = selRect.top;
            console.log("selectionchange: showing icon at", mouseX, mouseY);
            scheduleShowIcon();
          }
        } else {
          hideIcon();
        }
      });

      console.log("Yandex Translate content script loaded", {
        iconPath: ICON_PATH,
        version: "1.0",
      });
    }

    // Start when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (error) {
    console.error("[Yandex Translate] Content script error:", error);
  }
})();
