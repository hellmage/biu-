import * as WormHole from "./wormhole"
import {Point} from "../shapes/point"

export function init() {
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
    var p = `(${autocat.viewport.c2px(evt.pageX).valueOf()},${autocat.viewport.c2py(evt.pageY).valueOf()})`;
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
    autocat.viewport.setCursor(evt.pageX, evt.pageY);
  });
  plane.addEventListener("click", function(evt) {
    WormHole.emit(
      WormHole.Channels.AUTOCAT, {
        type: WormHole.UserInputType.M,
        data: {
          cx: evt.pageX,
          cy: evt.pageY,
          p: new Point(autocat.viewport.c2px(evt.pageX), autocat.viewport.c2py(evt.pageY))
        }
      }
    );
  })
}

const Radius = 40;  // pixels on canvas

export function draw(viewport, context) {
  var cx = viewport.cursorX, cy = viewport.cursorY;
  if (!cx || !cy)
    return;
  context.beginPath();
  context.moveTo(cx - Radius, cy);
  context.lineTo(cx + Radius, cy);
  context.moveTo(cx, cy - Radius);
  context.lineTo(cx, cy + Radius);
  context.stroke();
}
