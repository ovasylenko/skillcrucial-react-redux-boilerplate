import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import usersReducer from './users'

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  users: usersReducer
})

export default createRootReducer
