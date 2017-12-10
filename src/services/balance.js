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
    all = all.filter(currency => {
      if(currency.ticker  === 'BTC') return true;
      else if(currency.balance > 0.1) return true;
    })
    const balance = _.chain(all).groupBy('ticker').mapValues(v => {
      return v.map(returnBalance).reduce(sum);
    })

    return balance.value()
};

const returnBalance = (object) => {
  return object.balance;
}

const sum = (sum, v) => {
  return sum+v;
}

export default getTotalBalance;
