import * as functions from 'firebase-functions';
import logger from '../utils/logger';

const middlewareSecurity = (req, res, next) => {
  const token = req.get('Authorization');
  if(token === functions.config().token.value) {
    next();
  } else {
    logger.log('error', `Unathorized request, tried out token: ${token}`)
    res.sendStatus(401)
  }
}


export default middlewareSecurity
