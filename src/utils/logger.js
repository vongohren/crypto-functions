const winston = require('winston')
import * as functions from 'firebase-functions';
require('winston-papertrail').Papertrail;

const DEV = process.env.NODE_ENV !== 'production';
const papertrailConfig = functions.config().papertrail;

const winstonConsole = new winston.transports.Console({
    prettyPrint: true,
    colorize: 'all',
    silent: false,
    timestamp: false
})

const exceptionHandlers = [winstonConsole]
const transports = [winstonConsole]

if(!DEV) {
  const winstonPapertrail = new winston.transports.Papertrail({
    host: papertrailConfig.host,
    port: papertrailConfig.port,
    colorize: true,
    program: papertrailConfig.name
  })

  winstonPapertrail.on('error', function(err) {
    console.log(err);
  });

  exceptionHandlers.push(winstonPapertrail);
  transports.push(winstonPapertrail);
}

winston.handleExceptions(exceptionHandlers);

class Logger {
  constructor() {
      this.mainLogger = new winston.Logger({
        transports: transports
      });
  }

  log(level, message) {
      this.mainLogger[level](message);
  }

  close() {
      this.mainLogger.close()
  }
}

const LoggerClass = new Logger();

process.on("unhandledRejection", function(reason, promise) {
    LoggerClass.log('error', reason)
});

module.exports = LoggerClass;
