// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import HomeRoute from './Home'
import CounterRoute from './Counter/RouteAsync'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */
const IndexHtmlRoute = {
  pattern: '/index.html',
  exactly: true,
  component : HomeRoute.component
}
const Index2HtmlRoute = {
  pattern: '',
  exactly: true,
  component : HomeRoute.component
}

export const createRoutes = (store) => ({
  pattern        : window.__APP_BASE_PATH__,
  component   : CoreLayout,
  routes : [
    HomeRoute,
    IndexHtmlRoute,
    Index2HtmlRoute,
    CounterRoute(store)
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
