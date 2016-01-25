import {AutoCAT} from "./autocat"
import {ViewPort} from "./viewport"

function commandConsumer(evt) {
  var action = null;
  switch (evt.keyCode) {
    case '37':  // left
    case 37:
      action = "left";
      break;
    case '39':  // right
    case 39:
      action = "right";
      break;
    case '38':  // up
    case 38:
      action = "up";
      break;
    case '40':  // down
    case 40:
      action = "down";
      break;
    default:
      break;
  }
  if (action) {
    autocat.move(action);
  }
}

function registerKeyboardEvents(viewport) {
  document.addEventListener("keypress", function(evt) {
    var message = "keypressed: " + evt.which + ', ' + String.fromCharCode(evt.which) + ', ' + evt.metaKey + ', ' + evt.keyCode + ', ' + evt.charCode;
    console.log(message);
    commandConsumer(evt);
  });
}

function registerCursorEvents() {
  var tip = document.getElementById("coord-tip");
  var plane = document.getElementById("plane");
  plane.addEventListener("mouseenter", function(evt) {
    tip.style.zIndex = 99;
    tip.style.display = "inline";
  });
  plane.addEventListener("mouseout", function(evt) {
    tip.style.display = "none";
  });
  plane.addEventListener("mousemove", function(evt) {
    var c = `(${evt.pageX},${evt.pageY})`;
    var p = `(${autocat.viewport.c2px(evt.pageX)},${autocat.viewport.c2py(evt.pageY)})`;
    tip.innerHTML = `c${c}, p${p}`;
    var tipWidth = tip.offsetWidth, tipHeight = tip.offsetHeight;
    var top = evt.pageY + 5, left = evt.pageX + 5;
    if (top + tipHeight + 5 > evt.target.clientHeight)
      top = evt.pageY - tipHeight - 5;
    if (left + tipWidth + 5 > evt.target.clientWidth)
      left = evt.pageX - tipWidth - 5;
    tip.style.position = "fixed";
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  });
}

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
  registerKeyboardEvents();
  registerCursorEvents();
  initAnimation();
  window.autocat.updateVisibleShapes();
}

if (document.readyState != 'loading'){
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}
