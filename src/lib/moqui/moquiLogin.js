const base64 = require('base-64')

const AUTH_URL_PATH = 'http://3pl.test.com/rest/api_key'

export function login (name, pwd) {
  const bytes = name.trim() + ':' + pwd.trim()
  const encoded = base64.encode(bytes)
  return fetch(AUTH_URL_PATH, {
    method: 'GET',
    headers: {
      'Authorization' : 'Basic ' + encoded,
      'User-Agent': 'GitHub Issue Browser',
      'Content-Type': 'text/plain charset=utf-8'
    }
  })
    .then((response) => {
      const isValid = response.status < 400
      return response.text().then((apiKey) => {
        if (isValid) {
          return apiKey
        } else {
          throw new Error('...')
        }
      })
    })
}
