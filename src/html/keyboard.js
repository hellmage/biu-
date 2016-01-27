import * as wormhole from "./wormhole"

function commandConsumer(evt) {
  var moveAction = null;
  switch (evt.keyCode) {
    case '37':  // left
    case 37:
      moveAction = "left";
      autocat.move(moveAction)
      break;
    case '39':  // right
    case 39:
      moveAction = "right";
      autocat.move(moveAction)
      break;
    case '38':  // up
    case 38:
      moveAction = "up";
      autocat.move(moveAction)
      break;
    case '40':  // down
    case 40:
      moveAction = "down";
      autocat.move(moveAction)
      break;
    default:
      break;
  }
  switch (evt.charCode) {
    case '43':  // +
    case 43:
      autocat.zoomin();
      break;
    case '45':  // -
    case 45:
      autocat.zoomout();
      break;
    default:
      break;
  }
  switch (String.fromCharCode(evt.which)) {
    case 'l':
      break;
    default:

  }
}

export function init() {
  document.addEventListener("keypress", function(evt) {
    var message = "keypressed : " + evt.which + ', ' + String.fromCharCode(evt.which) + ', ' + evt.metaKey + ', ' + evt.keyCode + ', ' + evt.charCode;
    console.log(message);
    if (evt.target.id !== 'user-input')
      wormhole.emit(wormhole.Channels.AUTOCAT, String.fromCharCode(evt.which));
    commandConsumer(evt);
  });
}
