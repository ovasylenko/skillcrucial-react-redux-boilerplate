let createHistory
if (typeof document !== 'undefined') {
  const { createBrowserHistory } = require('history')
  createHistory = createBrowserHistory
} else {
  createHistory = require('history').createMemoryHistory
}
const history = createHistory
export default history
