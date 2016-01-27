export const Channels = {  // Enum
  AUTOCAT: "autocat"
}

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
