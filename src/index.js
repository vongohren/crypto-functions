const functions = require('firebase-functions');
import express from 'express';
import bitfinex from './lib/bitfinex';
import bittrex from './lib/bittrex';
import etherwallet from './lib/etherwallet';
import getBalance from './services/balance';
import security from './middleware/security';

process.on('unhandledRejection', r => console.log(r))

let app = express();

app.use(security)

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getBitfinexBalance = functions.https.onRequest(async (request, response) => {
  console.log(bitfinex)
  const bitfinexConfig = functions.config().bitfinex
  const balance = await bitfinex(bitfinexConfig.key, bitfinexConfig.secret);
  response.send(balance);
});

exports.getBittrexBalance = functions.https.onRequest(async (request, response) => {
  const bittrexConfig = functions.config().bittrex
  const balance = await bittrex(bittrexConfig.key, bittrexConfig.secret);
  response.send(balance);
});

exports.getEtherBalance = functions.https.onRequest(async (request, response) => {
  const balance = await etherwallet();
  response.send(balance);
});

exports.getBalance = functions.https.onRequest(async (request, response) => {
  const balance = await getBalance(functions);
  response.send(balance);
});

app.get('/getBalances', async (req, res) => {
  const balance = await getBalance(functions)
  res.send(balance)
});

// Expose Express API as a single Cloud Function:
exports.balances = functions.https.onRequest(app);
