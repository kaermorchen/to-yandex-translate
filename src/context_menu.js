browser.contextMenus.create({
  title: "Yandex Translate: %s",
  contexts: ["selection"],
  onclick: lookUpYandexTranslate,
});

function lookUpYandexTranslate(info) {
  if (info) {
    browser.storage.sync
      .get({
        window_height: 650,
        window_width: 900,
      })
      .then(function (result) {
        const url = "https://translate.yandex.ru/?text=" + info.selectionText;
        const w = result.window_width;
        const h = result.window_height;
        const left = screen.width / 2 - w / 2;
        const top = screen.height / 2 - h / 2;

        browser.windows.create({
          url: url,
          type: "popup",
          width: w,
          height: h,
          left: left,
          top: top,
        });
      }, console.error);
  }
}
