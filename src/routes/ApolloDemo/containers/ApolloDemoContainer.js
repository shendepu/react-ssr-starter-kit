import React, { Component, PropTypes } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// class ApolloDemo extends Component {
//   render () {
//     const { repository } = this.props
//     return (
//       <div>
//         {JSON.stringify(repository)}
//       </div>
//     )
//   }
// }
//
// ApolloDemo.propTypes = {
//   loading: PropTypes.bool,
//   repository: PropTypes.object
// }
//
// const demoQuery = gql`
// query {
//   repository(owner:"shendepu", name: "moqui-graphql") {
//     name
//     description
//   }
// }
// `
//
// const ApolloDemoWithData = graphql(demoQuery, {
//   props: ({ ownProps, data: { loading, repository } }) => {
//     return {
//       loading,
//       repository
//     }
//   }
// })(ApolloDemo)

class ApolloDemo extends Component {
  render () {
    const { mantle } = this.props
    return (
      <div>
        {JSON.stringify(mantle)}
      </div>
    )
  }
}

ApolloDemo.propTypes = {
  loading: PropTypes.bool,
  mantle: PropTypes.object
}

const demoQuery = gql`
query {
  mantle {
    parties (pagination: { pageSize: 2 }) {
      edges {
        node {
          partyId
          partyTypeEnumId
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
}
`

const ApolloDemoWithData = graphql(demoQuery, {
  props: ({ ownProps, data: { loading, mantle } }) => {
    return {
      loading,
      mantle
    }
  }
})(ApolloDemo)

export default ApolloDemoWithData
