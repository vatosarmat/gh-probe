import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer, persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import App from './components/App'
import reducer, { rootSaga } from 'state'

const pReducer = persistReducer(
  {
    key: 'root',
    storage
  },
  reducer
)
const sagaMiddleware = createSagaMiddleware()

const store = createStore(pReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
const persistor = persistStore(store)
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
