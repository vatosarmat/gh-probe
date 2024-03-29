import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import { createPersistentStore } from 'state'
import App from 'components/App'
import AppError from 'components/AppError'
import { appConfig } from 'config'

try {
  if (!appConfig.ghApiBaseUrl) {
    throw Error('No REACT_APP_GITHUB_PROXY_BASE_URL. It must be in env when build or in window when run')
  }
  //throw if string is not a URL
  new URL(appConfig.ghApiBaseUrl)

  const history = createBrowserHistory()
  const { store, persistor } = createPersistentStore(history)

  ReactDOM.render(React.createElement(App, { store, persistor, history }), document.getElementById('root'))
} catch (error) {
  ReactDOM.render(React.createElement(AppError, { error: error as Error }), document.getElementById('root'))
}
