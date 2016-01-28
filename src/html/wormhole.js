export const Channels = {  // Enum
  AUTOCAT: "autocat"
}

// There are three types of input:
// - G(lobal) keyboard event
// - T(extbox) from which strings are submitted
// - M(ouse) click on canvas
// Each of them has its own message data structure
export const UserInputType = {
  M: 'mouse',
  T: 'textbox',
  G: 'global'
}

// The message should be of uniform format
// {
//   type: UserInputType,
//   data: {
//     custom data structure
//   }
// }
export function emit(channel, message) {
  var event = null;
  if (window.CustomEvent) {
    event = new CustomEvent(channel, {detail: message});
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(channel, true, true, message);
  }
  var wormhole = document.getElementById("wormhole");
  wormhole.dispatchEvent(event);
}

export function init() {
  document.getElementById("wormhole").addEventListener(Channels.AUTOCAT, autocat.receive);
}
