import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import HomeView from './HomeView'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const r = ReactDOM.render(<HomeView />, div)
  console.log(r)
  let component = renderer.create(<HomeView />)
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  const wrapper = shallow(<HomeView />)

  expect(wrapper.find('h4').length).toBe(1)
})
