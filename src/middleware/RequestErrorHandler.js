import logger from '../utils/logger';
import rpErrors from 'request-promise/errors';

const requestErrorHandler = (error, req, res, next) => {
  if(error instanceof rpErrors.RequestError) {
    const statusCode = parseStatusCode(error);
    const message = parseMessage(error, statusCode);
    res.status(statusCode).send(message)
    return next();
  } else {
    next(error);
  }
};

const parseMessage = (error, code) => {
  let message = ""
  let errorObject = {}
  if(error.message.includes('ETIMEDOUT')) {
    message = 'The request timed out with the latter options'
    errorObject = { url: error.options.url, decidedTimeout: error.options.timeout, message: message }
  } else {
    message = "Server error, let the service know"
    errorObject = { url: error.options.url, message: message }
  }
  const logObject = {
      message: error.message,
      trace: error.stack,
      url: error.options.url,
      statusCode: code
  }

  logger.log('error', Object.assign({}, errorObject, logObject))
  return errorObject
}

const parseStatusCode = (error) => {
  let code = 500;
  if(error.statusCode) {
    code = error.statusCode
  }
  return code;
}


export default requestErrorHandler;
