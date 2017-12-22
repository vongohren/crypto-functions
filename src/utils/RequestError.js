export default class RequestError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, GoodError)
  }
}
