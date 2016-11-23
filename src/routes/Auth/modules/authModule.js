import { combineReducers } from 'redux'
import githubReducer from './github/githubModule'

export default combineReducers({
  github: githubReducer
})
