import 'whatwg-fetch'
const base64 = require('base-64')

const config = {
  GITHUB_CLIENT_ID: '083c8beafced3a6fb60d',
  GITHUB_CLIENT_SECRET: '0aa52cfb7d8e96f2372f921ff4de8ddff53c2ed8'
}

const AUTH_URL_PATH = 'https://api.github.com/authorizations'

export function login (name, pwd) {
  const bytes = name.trim() + ':' + pwd.trim()
  const encoded = base64.encode(bytes)
  console.log(name)
  console.log(pwd)
  return fetch(AUTH_URL_PATH, {
    method: 'POST',
    headers: {
      'Authorization' : 'Basic ' + encoded,
      'User-Agent': 'GitHub Issue Browser',
      'Content-Type': 'application/json charset=utf-8'
    },
    body: JSON.stringify({
      'client_id': config.GITHUB_CLIENT_ID,
      'client_secret': config.GITHUB_CLIENT_SECRET,
      'scopes': ['user', 'repo'],
      'note': 'not abuse'
    })
  })
    .then((response) => {
      const isValid = response.status < 400
      console.log(response)
      return response.json().then((json) => {
        if (isValid) {
          return json.token
        } else {
          throw new Error(json.message)
        }
      })
    })
}
