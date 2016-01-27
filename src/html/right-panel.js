import * as log from "./logging"

function input() {
  log.info(document.getElementById("user-input").value);
  document.getElementById("user-input").value = "";
}

export function init() {
  document.getElementById("submit").addEventListener("click", input)

  document.getElementById("user-input").addEventListener("keypress", function(evt) {
    if (evt.which === 13)
      input();
  })
}
