import { combineReducers } from 'redux'
import githubReducer from './github/githubModule'
import moquiReducer from './moqui/moquiModule'

export default combineReducers({
  github: githubReducer,
  moqui: moquiReducer
})
