import * as functions from 'firebase-functions';
import logger from './utils/logger';
import express from 'express';
import bitfinex from './lib/bitfinex';
import bittrex from './lib/bittrex';
import etherwallet from './lib/etherwallet';
import getBalance from './services/balance';
import security from './middleware/security';

process.on('unhandledRejection', r => logger.log('error',r))

let app = express();

app.use(security)
app.get('/getBalances', async (req, res) => {
  const balance = await getBalance(functions)
  res.send(balance)
});

// Expose Express API as a single Cloud Function:
exports.balances = functions.https.onRequest(app);
