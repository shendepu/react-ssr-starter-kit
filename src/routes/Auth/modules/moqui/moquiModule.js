import { login as loginMoqui } from 'lib/moqui/moquiLogin'
import { username, password } from 'lib/moqui/config'

const MOQUI_REST_API_LOGIN_IN_S = 'MOQUI_REST_API_LOGIN_IN_S'

export const login = () => dispatch => {
  return loginMoqui(username, password).then((apiKey) => {
    console.log('dispatch action MOQUI_REST_API_LOGIN_IN_S')
    console.log(apiKey)
    dispatch({ type: MOQUI_REST_API_LOGIN_IN_S, payload: { apiKey } })
    return apiKey
  })
}

const initialState = {
  loggedIn: false,
  apiKey: null
}

export default function moquiReducer (state = initialState, action) {
  let payload = action.payload

  switch (action.type) {
    case MOQUI_REST_API_LOGIN_IN_S:
      console.log('handle action MOQUI_REST_API_LOGIN_IN_S')
      console.log(payload)
      let o = Object.assign({}, state, { loggedIn: true, apiKey: payload.apiKey })
      console.log(o)
      return o
  }

  return state
}
