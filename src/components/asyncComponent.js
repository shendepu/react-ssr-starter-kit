import React from 'react'

let firstRoute = true

const asyncComponent = (getComponent) => class AsyncComponent extends React.Component {
  static Component = null

  mounted = false
  state = {
    Component: AsyncComponent.Component
  }

  componentDidMount () {
    this.mounted = true
    if (this.state.Component === null) {
      if (!firstRoute) {
        // progress start
      }

      getComponent().then(m => m.default).then(Component => {
        if (firstRoute) {
          firstRoute = false
        } else {
          // progress done
        }
        AsyncComponent.Component = Component
        if (this.mounted) {
          this.setState({ Component })
        }
      })
    }
  }

  componentWillUnmount () {
    this.mounted = false
  }

  render () {
    const { Component } = this.state
    if (Component !== null) {
//       console.log(Component)
      if (Component !== null) {
        return <Component {...this.props} />
      }
    }

    return (
      <div />
    )
  }
}

export default asyncComponent
