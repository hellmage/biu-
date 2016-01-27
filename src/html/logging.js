const LogCountMax = 500;

const Level = {  // Enum
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical',
  DEBUG: 'debug'
};

export function info(message) {
  log(Level.INFO, message);
}

export function warn(message) {
  log(Level.WARN, message);
}

export function critical(message) {
  log(Level.CRITICAL, message);
}

export function error(message) {
  log(Level.ERROR, message);
}

export function debug(message) {
  log(Level.DEBUG, message);
}

function log(level, message) {
  var container = document.getElementById("logs");
  if (container.children.length >= LogCountMax)
    container.removeChild(container.childNodes[container.children.length - 1]);
  container.innerHTML =
    `<p>[<span style='font-color:black'>${level.toUpperCase()}</span>]${message}</p>`
    + container.innerHTML;
}
