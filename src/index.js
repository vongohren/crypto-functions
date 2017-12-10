const functions = require('firebase-functions');
import bitfinex from './lib/bitfinex';
import bittrex from './lib/bittrex';
import etherwallet from './lib/etherwallet';
import getBalance from './services/balance';

process.on('unhandledRejection', r => console.log(r))

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
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
