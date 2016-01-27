import * as log from "./logging"
import * as wormhole from "./wormhole"

function emit() {
  log.info(document.getElementById("user-input").value);
  wormhole.emit(wormhole.Channels.AUTOCAT, document.getElementById("user-input").value);
  document.getElementById("user-input").value = "";
}

export function init() {
  document.getElementById("submit").addEventListener("click", emit)

  document.getElementById("user-input").addEventListener("keypress", function(evt) {
    if (evt.which === 13) emit(); // Enter
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
