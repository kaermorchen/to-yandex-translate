browser.contextMenus.create({
  title: "Yandex Translate: %s",
  contexts: ["selection"],
  onclick: lookUpYandexTranslate,
});

function lookUpYandexTranslate(info) {
  if (info) {
    var url = "https://translate.yandex.ru/?text=" + info.selectionText;
    var w = 940;
    var h = 650;
    var left = screen.width / 2 - w / 2;
    var top = screen.height / 2 - h / 2;

    browser.windows.create({
      url: url,
      type: "popup",
      width: w,
      height: h,
      left: left,
      top: top,
    });
  }
}
