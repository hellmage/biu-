import {AutoCAT} from "./autocat"
import {ViewPort} from "./viewport"
import {Plane} from "./plane"
import * as Keyboard from "./html/keyboard"
import * as Cursor from "./html/cursor"
import * as RightPanel from "./html/right-panel"
import * as WormHole from "./html/wormhole"

function initCanvas(canvas) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
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
  var canvas = document.getElementById("plane");
  initCanvas(canvas);
  var viewport = new ViewPort(canvas.width, canvas.height);
  window.autocat = new AutoCAT(new Plane(), viewport, canvas);
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
