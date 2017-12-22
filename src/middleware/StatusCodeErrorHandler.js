import logger from '../utils/logger';
import rpErrors from 'request-promise/errors';

const StatusCodeErrorHandler = (error, req, res, next) => {
  if(error instanceof rpErrors.StatusCodeError) {
    const message = parseMessage(error);
    res.status(error.statusCode).send(message)
    return next();
  } else {
    next(error);
  }
};

const parseMessage = (error) => {
  let message = ""
  logger.log('error', {
    message: error.message,
    trace: error.stack,
    code: error.statusCode
  })
  if(error.statusCode === 404) {
    message = "Cant find requested URL"
  }
  if(error.statusCode === 405) {
    message = "Seems like the API is forbidden, to many requests maybe?"
  }
  if(error.statusCode === 500) {
    message = "Just a general server error, will be fixed when log is noticed"
  }
  return { url: error.options.url, message: message }
}

export default StatusCodeErrorHandler;
