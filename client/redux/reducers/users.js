const GET_DATA = 'scillcrucial/users/GET_DATA'

const initialState = {
  list: [{ name: 'test' }]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        list: state.list.concat(action.list)
      }
    default:
      return state
  }
}
export function getData () {
  return (dispatch) => {
    dispatch({
      type: GET_DATA,
      list: [{ name: +(new Date()) }]
    })
  }
}
