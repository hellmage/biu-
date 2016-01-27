
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
    autocat.cx = evt.pageX;
    autocat.cy = evt.pageY;
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

const Radius = 40;  // pixels on canvas

export function draw(context, cx, cy) {
  if (!cx || !cy)
    return;
  context.beginPath();
  context.moveTo(cx - Radius, cy);
  context.lineTo(cx + Radius, cy);
  context.moveTo(cx, cy - Radius);
  context.lineTo(cx, cy + Radius);
  context.stroke();
}
