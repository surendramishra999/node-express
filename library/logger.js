const { createLogger, format, transports } = require('winston');

const { printf, simple, timestamp, colorize, combine } = format;

const level = process.env.LOG_LEVEL || 'debug';

const colorizer = colorize();

const logger = createLogger({
  level,
  format: combine(
    timestamp(),
    simple(),
    printf(msg =>
      colorizer.colorize(
        msg.level,
        `${msg.timestamp} - ${msg.level}: ${msg.message}`,
      ),
    ),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
