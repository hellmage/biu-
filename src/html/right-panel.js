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

  document.getElementById("right-panel-anchor").addEventListener("click", function(evt) {
    document.getElementById("right-panel-anchor").style.display = "none";
    document.getElementById("right-panel").style.display = "";
  })

  document.getElementById("hide-panel").addEventListener("click", function(evt) {
    document.getElementById("right-panel").style.display = "none";
    document.getElementById("right-panel-anchor").style.display = "block";
  })
}
