import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { MatchWithRoutes } from 'lib/react-router-addons-routes'
import Header from '../../components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'

const mapStateToProps = (state) => ({
  githubLoggedIn: state.auth.github.loggedIn,
  githubToken: state.auth.github.token,
  moquiLoggedIn: state.auth.moqui.loggedIn,
  moquiApiKey: state.auth.moqui.apiKey
})

const mapDispatchToProps = (dispatch) => ({
  actions: {},
  dispatch
})

export const CoreLayout = ({ basePath, routes, store, client, moquiLoggedIn }) => {
  return moquiLoggedIn
    ? <ApolloProvider store={store} client={client}>
      <div className='container text-center'>
        <Header />
        <div className='core-layout__viewport'>
          {routes.map((route, i) => (
            <MatchWithRoutes key={i} {...route} parentPattern={basePath} />
          ))}
        </div>
      </div>
    </ApolloProvider>
    : <div>Login...</div>
}

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
  client: PropTypes.object,
  basePath: PropTypes.string,
  routes: PropTypes.array.isRequired,
  githubLoggedIn: PropTypes.bool,
  githubToken: PropTypes.string,
  moquiLoggedIn: PropTypes.bool,
  moquiApiKey: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
