import React, { ReactElement } from 'react'
import { createBrowserHistory } from 'history'

import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'

import { createPersistentStore } from 'state'
import { searchUser, fetchUserAndRepos } from 'services/api'
import App from 'components/App'

import makeFx from 'services/api/fixtures'

jest.mock('services/api')

describe('App basic functionality', () => {
  let history
  let persistor
  let store
  let app: ReactElement
  let fx: ReturnType<typeof makeFx>

  beforeAll(() => {
    history = createBrowserHistory()
    ;({ persistor, store } = createPersistentStore(history))
    app = React.createElement(App, { history, store, persistor })
    fx = makeFx()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Successfully renders', () => {
    const { getByText, getByLabelText } = render(app)

    expect(getByText('GitHub repos')).toBeVisible()
    expect(getByLabelText('Settings')).toBeEnabled()
    expect(getByLabelText('Search user')).toBeEnabled()
    expect(getByText('Search')).toBeEnabled()
  })

  it('Opens and closes settings dialog', async () => {
    const { getByText, getByLabelText, queryByText } = render(app)
    expect(queryByText('Settings')).toBeNull()

    fireEvent.click(getByLabelText('Settings'))
    const closeButton = getByText(/close/i)
    expect(getByText('Settings')).toBeVisible()
    expect(getByText('Color scheme')).toBeVisible()
    expect(getByText(/repos per page/i)).toBeVisible()
    expect(getByText(/reset application state/i)).toBeEnabled()
    expect(closeButton).toBeEnabled()

    fireEvent.click(closeButton)
    await waitForElementToBeRemoved(() => queryByText('Settings'))
  })

  it('Searches users and shows repos', async () => {
    const expectedUserData = fx.users[0]
    ;(searchUser as jest.Mock).mockResolvedValueOnce(fx.usersSearchResult)
    ;(fetchUserAndRepos as jest.Mock).mockResolvedValueOnce([expectedUserData, fx.singleReposPage])

    //eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { getByLabelText, getByText } = render(app)
    const searchInput = getByLabelText('Search user')
    const searchButton = getByText(/^search$/i)
    fireEvent.change(searchInput, {
      target: {
        value: fx.usersSearchQuery
      }
    })
    fireEvent.click(searchButton)
    await waitForElement(() => fx.usersSearchResult.map(item => getByText(item.login)))

    fireEvent.click(getByText(expectedUserData.login))
    return waitForElement(() => [
      getByText(expectedUserData.name!),
      getByText(expectedUserData.bio!),
      getByText(fx.singleReposPage.repos[0].name)
    ])
  })
})
