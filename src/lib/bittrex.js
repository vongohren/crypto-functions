const crypto = require('crypto')
const rp = require('request-promise');

const baseUrl = 'https://api.bitfinex.com'

exports.getBalance = async function(key, secret) {
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
  console.log(returnBody)
}
