import { login as loginGithub } from 'lib/github/githubLogin'
import { username, password } from 'lib/github/config'

const GITHUB_GRAPHQL_API_LOGIN_IN_S = 'GITHUB_GRAPHQL_API_LOGIN_IN_S'

export const login = () => disptch => {
  return loginGithub(username, password).then((token) => {
    disptch({ type: GITHUB_GRAPHQL_API_LOGIN_IN_S, payload: { token } })
  })
}

const initialState = {
  loggedIn: false,
  token: null
}

export default function githubReducer (state = initialState, action) {
  let payload = action.payload

  switch (action.type) {
    case GITHUB_GRAPHQL_API_LOGIN_IN_S:
      return Object.assign({}, state, { loggedIn: true, token: payload.token })
  }

  return state
}
