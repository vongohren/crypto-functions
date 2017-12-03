const functions = require('firebase-functions');
const bittrex = require('./lib/bittrex');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getBalance = functions.https.onRequest(async (request, response) => {
  const bittrexConfig = functions.config()
  const balance = bittrex.getBalance(bittrexConfig.key, bittrexConfig.secret);
  response.send(balance);
});
