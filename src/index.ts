import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import { createPersistentStore } from 'state'
import { Api } from 'services/api'
import App from 'components/App'

const api = new Api()
const history = createBrowserHistory()
const { store, persistor } = createPersistentStore(api, history)

ReactDOM.render(React.createElement(App, { store, persistor, history }), document.getElementById('root'))
