var winston = require('winston')
var path = require('path')
var PROJECT_ROOT = path.join(__dirname, '../../..');
var appRoot = require('app-root-path');

var getFileInfo = function () {
  var stackInfo = getStackInfo(1);

  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';
    return calleeStr;
  }
  return '/devnull'
};


var paddingToFixLength = function (str, maxLength) {
  let strLength = str.length;

  if (strLength == maxLength) return str;
  if (strLength > maxLength) return '?' + str.substring(strLength - maxLength + 1)
  if (strLength < maxLength) return str +  Array(maxLength-strLength+1).join(' ');
}

const options = {
  file: {
    level: 'debug',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    timestamp: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      // for the log file
      winston.format.printf(info => `${info.timestamp} | ${paddingToFixLength(info.level, 5)} | ${info.message}`)
    )
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    timestamp: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      // for the log file
      winston.format.printf(info => `${info.timestamp} | ${paddingToFixLength(info.level, 5)} | ${info.message}`)
    ),
  }
};




var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

logger.stream = {
  write: function () {
    logger.info.apply(logger, formatLogArguments(arguments))

    //logger.info(message)
  }
};

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.

module.exports.debug = module.exports.log = function () {
  logger.debug.apply(logger, formatLogArguments(arguments))
};

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments))
};

module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments))
};

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments))
};

module.exports.stream = logger.stream;

console.log = module.exports.info;
console.info = module.exports.info;
console.warn = module.exports.warn;
console.error = module.exports.error;
console.debug = module.exports.debug;


/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments (args) {
  args = Array.prototype.slice.call(args)

  var stackInfo = getStackInfo(1)

  let maxLength = 35;

  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = stackInfo.relativePath + ':' + stackInfo.line;

    if (calleeStr.startsWith('node_modules/morgan/index')){
      calleeStr = 'Express API'
    }

    calleeStr = paddingToFixLength(calleeStr, maxLength)
    calleeStr = ''+calleeStr+'';

    calleeStr = calleeStr + ' | ';

    if (typeof (args[0]) === 'string') {
      if (args[0].endsWith('\n'))
        args[0] = args[0].substring(0, args[0].length - 1);
      args[0] = calleeStr + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }

  return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  var stacklist = (new Error()).stack.split('\n').slice(3)

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}