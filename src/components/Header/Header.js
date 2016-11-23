import React from 'react'
import { Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>React SSR Starter Kit</h1>
    <Link to={window.__APP_BASE_PATH__ + '/'} activeClassName='route--active'>
      Home
    </Link>
    {' · '}
    <Link to={window.__APP_BASE_PATH__ + '/counter'} activeClassName='route--active'>
      Counter
    </Link>
    {' · '}
    <Link to={window.__APP_BASE_PATH__ + '/apollo-demo'} activeClassName='route--active'>
      Apollo Demo
    </Link>
  </div>
)

export default Header
