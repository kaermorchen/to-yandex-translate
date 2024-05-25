document.querySelectorAll("[data-locale]").forEach((elem) => {
  const translation = browser.i18n.getMessage(elem.dataset.locale);

  if (translation) {
    elem.innerText = translation;
  }
});
