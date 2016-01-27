import {AutoCAT} from "./autocat"
import {ViewPort} from "./viewport"
import * as Keyboard from "./html/keyboard"
import * as Cursor from "./html/cursor"
import * as RightPanel from "./html/right-panel"
import * as WormHole from "./html/wormhole"

function initCanvas(plane) {
  plane.width = plane.offsetWidth;
  plane.height = plane.offsetHeight;
}

function animate() {
  autocat.draw();
  requestAnimationFrame(animate);
}

function initAnimation() {
  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000/60); };
  animate();
}

function ready() {
  var plane = document.getElementById("plane");
  var viewport = new ViewPort(plane.offsetWidth, plane.offsetHeight);
  window.autocat = new AutoCAT(viewport, plane);
  initCanvas(plane);
  WormHole.init();
  RightPanel.init();
  Keyboard.init();
  Cursor.init();
  initAnimation();
  autocat.updateVisibleShapes();
}

if (document.readyState != 'loading'){
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}
