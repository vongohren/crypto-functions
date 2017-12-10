const currencyJson = (ticker, balance) => {
  return {
    ticker: ticker.toUpperCase(),
    balance: balance
  }
}

export default currencyJson
