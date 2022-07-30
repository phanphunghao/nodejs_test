const winston = require ('winston');
const {createLogger, format, transports} = winston;
const {combine, timestamp, printf} = format;
require ('winston-daily-rotate-file');

const myFormat = printf (info => {
  return `\n${info.timestamp} [${info.level}]: ${info.message}`;
});

const Logger = createLogger ({
  format           : combine (
    timestamp (),
    myFormat
  ),
  transports       : [
    new transports.DailyRotateFile ({
      level           : APP_SETTINGS.LOG_LEVEL,
      filename        : __ROOT + '/logs/app-%DATE%.log',
      datePattern     : 'YYYY-MM-DD',
      zippedArchive   : true,
      maxFiles        : '30d',
      handleExceptions: true,
      json            : false,
      colorize        : false
    })
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile ({
      level           : 'error',
      filename        : __ROOT + '/logs/error-%DATE%.log',
      datePattern     : 'YYYY-MM-DD',
      zippedArchive   : true,
      maxSize         : '9m',
      maxFiles        : '30d',
      handleExceptions: true,
      json            : false,
      colorize        : false
    })
  ],
  exitOnError      : false
});

module.exports = Logger;
