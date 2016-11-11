import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { MatchWithRoutes } from 'lib/react-router-addons-routes'
import Header from '../../components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ basePath, routes, store }) => (
  <Provider store={store}>
    <div className='container text-center'>
      <Header />
      <div className='core-layout__viewport'>
        {routes.map((route, i) => (
          <MatchWithRoutes key={i} {...route} parentPattern={basePath} />
        ))}
      </div>
    </div>
  </Provider>
)

CoreLayout.propTypes = {
  router: PropTypes.object.isRequired,
  action: PropTypes.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.any,
    key: PropTypes.string
  }).isRequired,
  store: PropTypes.object.isRequired,
  basePath: PropTypes.string,
  routes: PropTypes.array.isRequired
}

export default CoreLayout
