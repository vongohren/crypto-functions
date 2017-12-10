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

    const all = bittrexBalance.concat(bitfinexBalance).concat(etherBalance);

    const whaat = _.chain(all).groupBy('ticker').flattenDeep()

    console.log(whaat.value())
};

export default getTotalBalance;
