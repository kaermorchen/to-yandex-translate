function saveOptions(e) {
  e.preventDefault();

  chrome.storage.sync.set({
    window_width: parseInt(document.querySelector("#window_width").value),
    window_height: parseInt(document.querySelector("#window_height").value),
    target: document.querySelector("[name='target']:checked").id,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#window_width").value = result.window_width;
    document.querySelector("#window_height").value = result.window_height;
    document.querySelector(`#${result.target}`).checked = true;
  }

  let getting = chrome.storage.sync.get({
    window_height: 650,
    window_width: 900,
    target: "window",
  });

  getting.then(setCurrentChoice, console.error);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
