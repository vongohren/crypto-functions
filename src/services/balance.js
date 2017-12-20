import bitfinex from '../lib/bitfinex';
import bittrex from '../lib/bittrex';
import etherwallet from '../lib/etherwallet';
import _ from 'lodash';

const getTotalBalance = async (functions) => {
    const bittrexConfig = functions.config().bittrex;
    const bitfinexConfig = functions.config().bitfinex;
    const bitfinexBalance = await bitfinex(bitfinexConfig.key, bitfinexConfig.secret);
    const bittrexBalance = await bittrex(bittrexConfig.key, bittrexConfig.secret);
    const etherBalance = await etherwallet();

    let all = bittrexBalance.concat(bitfinexBalance).concat(etherBalance);
    let balance = _.chain(all).groupBy('ticker').mapValues(v => {
      return v.map(returnBalance).reduce(sum);
    }).value()

    balance = mergeSchizophrenicTickers(balance);
    return balance
};

const mergeSchizophrenicTickers = (balance) => {
  if(balance.QTM || balance.QTUM) {
    balance.QTUM += balance.QTM
    delete balance.QTM
  }
  return balance
}

const returnBalance = (object) => {
  return object.balance;
}

const sum = (sum, v) => {
  return sum+v;
}

export default getTotalBalance;
