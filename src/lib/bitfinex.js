const crypto = require('crypto')
const rp = require('request-promise');
import Currency from '../models/currency';
import CurrencyJson from '../models/currencyJson';

const baseUrl = 'https://api.bitfinex.com'

const getBalance = async (key, secret) => {
  const url = '/v1/balances'
  const nonce = Date.now().toString()
  const completeURL = baseUrl + url
  const body = {
    request: url,
    nonce
  }
  const payload = new Buffer(JSON.stringify(body))
      .toString('base64')

  const signature = crypto
    .createHmac('sha384', secret)
    .update(payload)
    .digest('hex')

  const options = {
    method: 'POST',
    url: completeURL,
    headers: {
      'X-BFX-APIKEY': key,
      'X-BFX-PAYLOAD': payload,
      'X-BFX-SIGNATURE': signature
    },
    body: JSON.stringify(body)
  }

  const returnBody = await rp.post(options)
  return JSON.parse(returnBody);
}

const getUniversalBalance = async (key,secret) => {
  const bitfinexBalance = await getBalance(key,secret);
  return convertToUniversalBalance(bitfinexBalance);
}


const convertToUniversalBalance = (bitfinexBalance) => {
  return bitfinexBalance.map(currency=> {
    return CurrencyJson(currency.currency, parseFloat(currency.amount))
  })
}

export default getUniversalBalance;
