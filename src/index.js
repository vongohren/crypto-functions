import * as functions from 'firebase-functions';
import express from 'express';
import getBalance from './services/balance';
import security from './middleware/security';
import asyncMiddleware from './middleware/asyncMiddleware';
import StatusCodeErrorHandler from './middleware/StatusCodeErrorHandler';
import RequestErrorHandler from './middleware/RequestErrorHandler';

let app = express();

app.use(security)

app.get('/getBalances', asyncMiddleware(async (req, res) => {
  const balance = await getBalance(functions)
  res.send(balance)
}));

app.use(StatusCodeErrorHandler)
app.use(RequestErrorHandler)


exports.balances = functions.https.onRequest(app);
