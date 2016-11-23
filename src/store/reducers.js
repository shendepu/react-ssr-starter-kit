import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from 'routes/Auth/modules/authModule'

export const makeRootReducer = (apolloClient, asyncReducers, initialState) => {
  let missingReducers = { }
  if (initialState !== undefined && typeof initialState === 'object') {
    for (let key in initialState) {
      if (!asyncReducers.hasOwnProperty(key)) {
        missingReducers[key] = () => initialState[key]
      }
    }
  }
  return combineReducers({
    location: locationReducer,
    apollo: apolloClient.reducer(),
    auth: authReducer,
    ...asyncReducers,
    ...missingReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.apolloClient, store.asyncReducers))
}

export default makeRootReducer
