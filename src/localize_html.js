document.querySelectorAll("[data-locale]").forEach((elem) => {
  const translation = chrome.i18n.getMessage(elem.dataset.locale);

  if (translation) {
    elem.innerText = translation;
  }
});
