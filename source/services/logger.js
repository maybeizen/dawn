const winston = require("winston");
const { format } = winston;
const c = require("chalk");

function getCurrentTimestamp() {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return timestamp;
}

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf((info) => {
      let message = `${info.timestamp} [${info.level.toUpperCase()}]: ${
        info.message
      }`;
      if (info.level === "error") {
        message = `${info.timestamp} [ERROR]: ${info.message}`;
      }
      return message;
    }),
  ),
  transports: [
    new winston.transports.File({
      filename: `logs/${getCurrentTimestamp()}_dawn.log`,
    }),
  ],
});

console.log(c.cyan(`Started service logger...`));

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

console.log = function (...args) {
  logger.info(args.join(" "));
  originalConsole.log(...args);
};

console.error = function (...args) {
  logger.error(args.join(" "));
  originalConsole.error(...args);
};

console.warn = function (...args) {
  logger.warn(args.join(" "));
  originalConsole.warn(...args);
};

console.info = function (...args) {
  logger.info(args.join(" "));
  originalConsole.info(...args);
};

console.debug = function (...args) {
  logger.debug(args.join(" "));
  originalConsole.debug(...args);
};
