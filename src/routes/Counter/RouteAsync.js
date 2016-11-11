import asyncComponent from 'components/asyncComponent'
import { injectReducer } from '../../store/reducers'

export default (store) => ({
  pattern : '/counter',
  /*  Async getComponent is only invoked when route matches   */
  component: asyncComponent(() => {
    return new Promise(resolve => {
      require.ensure([], (require) => {
        /*  Webpack - use require callback to define
         dependencies for bundling   */
        const Counter = require('./containers/CounterContainer')
        const reducer = require('./modules/counter').default

        /*  Add the reducer to the store on key 'counter'  */
        injectReducer(store, { key: 'counter', reducer })

        /*  Return getComponent   */
        resolve(Counter)
        /* Webpack named bundle   */
      }, 'counter')
    })
  })
// When using System.import, the best way is using a single file that imports
// multiple imports, then using System.import to import this single file to
// create only one bundle. See http://stackoverflow.com/a/40275174.
// So use require.ensure instead
//
//   component: asyncComponent(() => {
//     return Promise.all([
//       System.import('./containers/CounterContainer'),
//       System.import('./modules/counter')])
//       .then(([Counter, reducer]) => {
//         injectReducer(store, { key: 'counter', reducer: reducer.default })
//         console.log('------- Counter ')
//         console.log(Counter.default)
//         return Counter
//       })
//   })
})
