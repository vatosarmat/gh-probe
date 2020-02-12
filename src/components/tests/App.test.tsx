import React, { ReactElement } from 'react'
import { createBrowserHistory } from 'history'

import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'

import { createPersistentStore } from 'state'
import { Api } from 'services/api'
import App from 'components/App'

jest.mock('services/api')

export const api = new Api('THIS IS MOCK')

describe('App basic functionality', () => {
  let history
  let persistor
  let store
  let app: ReactElement

  beforeAll(() => {
    history = createBrowserHistory()
    ;({ persistor, store } = createPersistentStore(api, history))
    app = React.createElement(App, { history, store, persistor })
  })

  it('Successfully renders', () => {
    render(app)

    expect(screen.getByText('GitHub repos')).toBeVisible()
    expect(screen.getByLabelText('Settings')).toBeEnabled()
    expect(screen.getByLabelText('Search user')).toBeEnabled()
    expect(screen.getByText('Search')).toBeEnabled()
  })

  it('Opens and closes settings dialog', () => {
    render(app)

    expect(screen.queryByText('Settings')).toBeNull()

    fireEvent.click(screen.getByLabelText('Settings'))
    const settingsHeader = screen.getByText('Settings')
    const closeButton = screen.getByText(/close/i)

    expect(settingsHeader).toBeVisible()
    expect(screen.getByText('Color scheme')).toBeVisible()
    expect(screen.getByText(/repos per page/i)).toBeVisible()
    expect(screen.getByText(/reset application state/i)).toBeEnabled()
    expect(closeButton).toBeEnabled()

    fireEvent.click(closeButton)
    waitForElementToBeRemoved(() => settingsHeader)
  })

  // it('Inputs and searchs users', () => {

  // })
})
