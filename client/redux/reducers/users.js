// import { ERROR } from 'jest-validate/build/utils'

const GET_DATA = 'skillCrucial/users/GET_DATA'
const ERROR_HAPPENED = 'skillCrucial/users/ERROR_HAPPENED'
const REQUEST_STARTED = 'skillCrucial/users/REQUEST_STARTED'
const REQUEST_DONE = 'skillCrucial/users/REQUEST_DONE'


const initialState = {
  list: [],
  inRequesting: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        list: action.list
      }
    case REQUEST_STARTED:
      return {
        ...state,
        inRequesting: true
      }
    case REQUEST_DONE:
      return {
        ...state,
        inRequesting: false
      }
    default:
      return state
  }
}

export function getData() {
  return (dispatch) => {
    dispatch({ type: REQUEST_STARTED })
    return fetch('/api/usres')
      .then(res => res.json())
      .then((json) => {
        dispatch({
          type: GET_DATA,
          list: json
        })
        dispatch({ type: REQUEST_DONE })
      })
      .catch((err) => {
        dispatch({
          type: ERROR_HAPPENED,
          err
        })
        dispatch({ type: REQUEST_DONE })
      })
  }
}
