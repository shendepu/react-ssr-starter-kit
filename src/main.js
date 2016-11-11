import React from 'react'
import ReactDOM from 'react-dom'
import ReactDomServer from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import { matchRoutesToLocation } from 'lib/react-router-addons-routes'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import CoreLayout from './layouts/CoreLayout'

require('es6-promise').polyfill()

class App {
  store = null

  constructor () {
    // ========================================================
    // Store Instantiation
    // ========================================================
    const initialState = window.___INITIAL_STATE__
    this.store = createStore(initialState)
  }

  render () {
    const store = this.store
    // ========================================================
    // Render Setup
    // ========================================================
    let render

    if (window.__APP_BASE_PATH__ === undefined) {
      window.__APP_BASE_PATH__ = ''
    }

    if (!window.__IS_SSR__) {
      const MOUNT_NODE = document.getElementById('root')

      render = () => {
        // routes should be here and in require form so that HMR works
        const rootRoute = require('./routes/index').default(store)
        ReactDOM.render(
          <AppContainer store={store} routes={rootRoute.routes} basePath={rootRoute.pattern} />,
          MOUNT_NODE
        )
      }

      // ========================================================
      // Developer Tools Setup
      // ========================================================
      if (__DEV__) {
        if (window.devToolsExtension) {
          window.devToolsExtension.open()
        }
      }

      // This code is excluded from production bundle
      if (__DEV__) {
        if (module.hot) {
          // Development render functions
          const renderApp = render
          const renderError = (error) => {
            const RedBox = require('redbox-react').default

            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
          }

          // Wrap render in try/catch
          render = () => {
            try {
              renderApp()
            } catch (error) {
              renderError(error)
            }
          }

          // Setup hot module replacement
          module.hot.accept('./routes/index', () =>
            setImmediate(() => {
              ReactDOM.unmountComponentAtNode(MOUNT_NODE)
              render()
            })
          )
        }
      }
    } else {
      const context = createServerRenderContext()
      const requestUrl = window.__REQ_URL__ || '/'
      const location = { pathname: requestUrl }

      const rootRoute = require('./routes/index').default(store)
      const { matchedRoutes, params } = matchRoutesToLocation(rootRoute.routes, location, [], {}, rootRoute.pattern)
      render = () => {
        return Promise.all(
          matchedRoutes.filter(route => route.component.loadData).map(route => route.component.loadData(store, params))
        ).then(() => {
          return ReactDomServer.renderToString(
            <ServerRouter location={requestUrl} context={context}>
              {({ action, location, router }) =>
                <CoreLayout {...{ router,
                  action,
                  location,
                  store,
                  routes: rootRoute.routes,
                  basePath: rootRoute.pattern }} />}
            </ServerRouter>
          )
        })
      }
    }
    return render()
  }

  getState () {
    return this.store.getState()
  }
}

// // ========================================================
// // Render Setup
// // ========================================================
// let render
//
// if (window.__APP_BASE_PATH__ === undefined) {
//   window.__APP_BASE_PATH__ = ''
// }
//
// if (!window.__IS_SSR__) {
//   const MOUNT_NODE = document.getElementById('root')
//
//   render = () => {
//     // routes should be here and in require form so that HMR works
//     const rootRoute = require('./routes/index').default(store)
//
//     ReactDOM.render(
//       <AppContainer store={store} routes={rootRoute.routes} basePath={rootRoute.pattern} />,
//       MOUNT_NODE
//     )
//   }
//
// // ========================================================
// // Developer Tools Setup
// // ========================================================
//   if (__DEV__) {
//     if (window.devToolsExtension) {
//       window.devToolsExtension.open()
//     }
//   }
//
// // This code is excluded from production bundle
//   if (__DEV__) {
//     if (module.hot) {
//       // Development render functions
//       const renderApp = render
//       const renderError = (error) => {
//         const RedBox = require('redbox-react').default
//
//         ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
//       }
//
//       // Wrap render in try/catch
//       render = () => {
//         try {
//           renderApp()
//         } catch (error) {
//           renderError(error)
//         }
//       }
//
//       // Setup hot module replacement
//       module.hot.accept('./routes/index', () =>
//         setImmediate(() => {
//           ReactDOM.unmountComponentAtNode(MOUNT_NODE)
//           render()
//         })
//       )
//     }
//   }
// } else {
//   const context = createServerRenderContext()
//   const requestUrl = window.__REQ_URL__ || '/'
//   const location = { pathname: requestUrl }
//
//   const rootRoute = require('./routes/index').default(store)
//   const { matchedRoutes, params } = matchRoutesToLocation(rootRoute.routes, location, [], {}, rootRoute.pattern)
//
//   render = () => {
//     return Promise.all(
//       matchedRoutes.filter(route => route.component.loadData).map(route => route.component.loadData(store, params))
//     ).then(() => {
//       return ReactDomServer.renderToString(
//         <ServerRouter location={requestUrl} context={context}>
//           {({ action, location, router }) =>
//             <CoreLayout {...{ router,
//               action,
//               location,
//               store,
//               routes: rootRoute.routes,
//               basePath: rootRoute.pattern }} />}
//         </ServerRouter>
//       )
//     })
//   }
// }

// const getState = () => store.getState()
//
// export {
//   render,
//   getState
// }
// ========================================================
// Go!
// ========================================================
export default App

if (!window.__IS_SSR__) {
  new App().render()
}
