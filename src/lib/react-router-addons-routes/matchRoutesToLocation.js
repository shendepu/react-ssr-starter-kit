import matchPattern from 'react-router/matchPattern'
import { mergePatterns } from './util'

const matchRoutesToLocation = (routes, location, matchedRoutes = [], params = {}, parentPattern = '/') => {
  routes.forEach((route) => {
    const nestedPattern = mergePatterns(parentPattern, route.pattern)
    const match = matchPattern(nestedPattern, location, route.exactly)

    if (match) {
      matchedRoutes.push(route)

      if (match.params) {
        Object.keys(match.params).forEach(key => { params[key] = match.params[key] })
      }

      if (route.routes) {
        matchRoutesToLocation(route.routes, location, matchedRoutes, params, nestedPattern)
      }
    }
  })

  return { matchedRoutes, params }
}

export default matchRoutesToLocation
