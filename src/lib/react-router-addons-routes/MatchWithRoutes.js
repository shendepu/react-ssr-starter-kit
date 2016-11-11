import React, { PropTypes } from 'react'
import { Match } from 'react-router'
import { mergePatterns } from './util'

const MatchWithRoutes = ({ parentPattern = '/', pattern, routes, component:Component, ...rest }) => {
  const nestedPattern = mergePatterns(parentPattern, pattern)
  return (
    <Match {...rest} pattern={nestedPattern} render={(matchProps) => (
      <Component {...matchProps} parentPattern={pattern} routes={routes} />
    )} />
  )
}

MatchWithRoutes.propTypes = {
  parentPattern: PropTypes.string,
  pattern: PropTypes.string.isRequired,
  routes: PropTypes.array,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
}

export default MatchWithRoutes
