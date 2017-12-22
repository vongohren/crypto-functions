const rp = require('request-promise');
import Currency from '../models/currency';
import CurrencyJson from '../models/currencyJson';

const baseUrl = 'https://api.ethplorer.io'

const getAddressData = async function() {
  const apiKey = 'freekey';
  const address = '0xae7ae37d9D97ABc1099995036f17701fd55cefE5'
  const url = `/getAddressInfo/${address}?apiKey=${apiKey}`
  const completeURL = baseUrl + url

  const options = {
    method: 'GET',
    url: completeURL,
    resolveWithFullResponse: true,
    timeout: 6000
  }

  const response = await rp.post(options)
  return JSON.parse(response.body);
}

const getTotalBalanceWalletBalance = async () => {
  const addressData = await getAddressData();
  return convertToUniversalBalance(addressData);
}

const convertToUniversalBalance = (addressData) => {
  const balance = addressData;
  const ethereumBalance = []
  ethereumBalance.push(CurrencyJson('ETH', addressData.ETH.balance))
  const tokenBalances = addressData.tokens.map(tokenData=> {
    return turnTokenDataToACurrency(tokenData)
  })
  return ethereumBalance.concat(tokenBalances);
}

const turnTokenDataToACurrency = (tokenData) => {
  const balance = tokenData.balance
  const decimals = tokenData.tokenInfo.decimals
  const symbol = tokenData.tokenInfo.symbol
  return CurrencyJson(symbol, calculateBalanceWithDecimals(balance, decimals))
}

const calculateBalanceWithDecimals = (balance, decimals) => {
  const divisor = Math.pow(10,decimals)
  return balance/divisor;
}

export default getTotalBalanceWalletBalance;
