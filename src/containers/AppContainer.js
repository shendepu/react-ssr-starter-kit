import React, { Component, PropTypes } from 'react'
import BrowserRouter from 'react-router/BrowserRouter'

import Layout from '../layouts/CoreLayout'

class AppContainer extends Component {
  static propTypes = {
    basePath: PropTypes.string.isRequired,
    routes : PropTypes.array.isRequired,
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { basePath, routes, store } = this.props

    return (
      <BrowserRouter>
        {
          ({ action, location, router }) => <Layout {...{ router, action, location, store, routes, basePath }} />
        }
      </BrowserRouter>
    )
  }
}

export default AppContainer
