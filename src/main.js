window.requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) { setTimeout(callback, 1000/60); };

function animate() {
  autocat.draw();
  requestAnimationFrame(animate);
}

function commandConsumer(evt) {
  switch (evt.keyCode) {
    case '37':  // left
      window.autocat.move("left");
      break;
    case '39':  // right
      window.autocat.move("right");
      break;
    case '38':  // up
      window.autocat.move("up");
      break;
    case '40':  // down
      window.autocat.move("down");
      break;
  }
}

function registerKeyboardEvents(viewport) {
  $(document).keypress(function(evt) {
    var message = "keypressed: " + evt.which + ', ' + String.fromCharCode(evt.which) + ', ' + evt.metaKey + ', ' + evt.keyCode + ', ' + evt.charCode;
    $("#statusline").html(message);
    console.log(message);
    commandConsumer(evt);
  });
}

function registerCursorEvents() {
  var tip = "#coord-tip";
  $("#plane").mouseenter(function(evt) {
    $(tip).css("z-index", 99).css("display", "inline");
  }).mouseout(function(evt) {
    $(tip).css("display", "none");
  }).mousemove(function(evt) {
    $(tip).html("(" + evt.pageX + ", " + evt.pageY + ")");  // FIXME show the plane coordinate
    var tipWidth = $(tip).width(), tipHeight = $(tip).height();
    var top = evt.pageY + 5, left = evt.pageX + 5;
    if (top + tipHeight + 5 > evt.target.clientHeight)
      top = evt.pageY - tipHeight - 5;
    if (left + tipWidth + 5 > evt.target.clientWidth)
      left = evt.pageX - tipWidth - 5;
    $(tip).css("position", "fixed").css("left", left).css("top", top);
  });
}

$(document).ready(function() {
  var viewport = new ViewPort($("#plane").width(), $("#plane").height());
  window.autocat = new AutoCAT(viewport, $("#plane")[0]);
  registerKeyboardEvents();
  registerCursorEvents();
  animate();
})
