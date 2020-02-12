import React from 'react'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import { Persistor } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { History } from 'history'
import CssBaseline from '@material-ui/core/CssBaseline'

import Ui from 'components/Ui'

interface AppProps {
  history: History
  store: Store
  persistor: Persistor
}

const App: React.FC<AppProps> = ({ history, store, persistor }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <Ui history={history} />
    </PersistGate>
  </Provider>
)

export default App
