import React, { Component, PropTypes } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class ApolloDemo extends Component {
  render () {
    const { repository } = this.props
    return (
      <div>
        {JSON.stringify(repository)}
      </div>
    )
  }
}

ApolloDemo.propTypes = {
  loading: PropTypes.bool,
  repository: PropTypes.object
}

const demoQuery = gql`
query {
  repository(owner:"shendepu", name: "moqui-graphql") {
    name
    description
  }
}
`

const ApolloDemoWithData = graphql(demoQuery, {
  props: ({ ownProps, data: { loading, repository } }) => {
    return {
      loading,
      repository
    }
  }
})(ApolloDemo)

export default ApolloDemoWithData
