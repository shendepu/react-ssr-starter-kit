import asyncComponent from 'components/asyncComponent'

export default (store) => ({
  pattern : '/apollo-demo',
  /*  Async getComponent is only invoked when route matches   */
  component: asyncComponent(() => {
    return new Promise(resolve => {
      require.ensure([], (require) => {
        /*  Webpack - use require callback to define
         dependencies for bundling   */
        const ApolloDemoContainer = require('./containers/ApolloDemoContainer')

        /*  Return getComponent   */
        resolve(ApolloDemoContainer)
        /* Webpack named bundle   */
      }, 'apollo-demo')
    })
  })
})
