import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'

import Ui from 'components/Ui'
import AppError from 'components/AppError'
import { rootSaga, SagaContext, persistedReducer } from 'state'
import { Api } from 'services/api'

try {
  if (!process.env.REACT_APP_GITHUB_PROXY_BASE_URL) {
    throw Error('No REACT_APP_GITHUB_PROXY_BASE_URL in env')
  }
  //throw if string is not a URL
  new URL(process.env.REACT_APP_GITHUB_PROXY_BASE_URL)

  const api = new Api(process.env.REACT_APP_GITHUB_PROXY_BASE_URL)
  const history = createBrowserHistory()

  const context: SagaContext = { api }
  const sagaMiddleware = createSagaMiddleware({ context })
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
  const persistor = persistStore(store, null, () => {
    const state = store.getState()
    const login = state.user.data?.login
    if (login) {
      history.replace(`/users/${login}`)
    }
  })

  sagaMiddleware.run(rootSaga)

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <Ui history={history} />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
} catch (error) {
  ReactDOM.render(<AppError error={error} />, document.getElementById('root'))
}
