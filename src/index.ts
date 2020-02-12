import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import { createPersistentStore } from 'state'
import { Api } from 'services/api'
import App from 'components/App'
import AppError from 'components/AppError'

try {
  if (!process.env.REACT_APP_GITHUB_PROXY_BASE_URL) {
    throw Error('No REACT_APP_GITHUB_PROXY_BASE_URL in env')
  }
  //throw if string is not a URL
  new URL(process.env.REACT_APP_GITHUB_PROXY_BASE_URL)

  const api = new Api(process.env.REACT_APP_GITHUB_PROXY_BASE_URL)
  const history = createBrowserHistory()
  const { store, persistor } = createPersistentStore(api, history)

  ReactDOM.render(React.createElement(App, { store, persistor, history }), document.getElementById('root'))
} catch (error) {
  ReactDOM.render(React.createElement(AppError, { error }), document.getElementById('root'))
}
