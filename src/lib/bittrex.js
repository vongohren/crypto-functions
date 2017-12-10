const crypto = require('crypto')
const rp = require('request-promise');
import Currency from '../models/currency';
import CurrencyJson from '../models/currencyJson';

const baseUrl = 'https://bittrex.com/api'

const getBalance = async function(key, secret) {
  const nonce = Date.now().toString()
  const url = '/v1.1/account/getbalances?apikey='+key+'&nonce='+nonce
  const completeURL = baseUrl + url

  const signature = crypto
    .createHmac('sha512', secret)
    .update(completeURL)
    .digest('hex')

  const options = {
    method: 'GET',
    headers: {
      'apisign': signature
    },
    url: completeURL
  }

  const returnBody = await rp.post(options)
  return JSON.parse(returnBody);
}

const getUniversalBalance = async (key,secret) => {
  const bittrexBalance = await getBalance(key,secret);
  return convertToUniversalBalance(bittrexBalance);
}

const convertToUniversalBalance = (bittrexBalance) => {
  return bittrexBalance.result.map(currency=> {
    return CurrencyJson(currency.Currency, currency.Balance)
  })
}

export default getUniversalBalance;
