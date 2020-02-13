import React, { ReactElement } from 'react'
import { createBrowserHistory } from 'history'

import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react'

import { createPersistentStore } from 'state'
import { Api, ReposPage, ReposPager } from 'services/api'
import App from 'components/App'

import makeFx from 'services/api/fixtures'

jest.mock('services/api')

export const api = new Api('THIS IS MOCK')

describe('App basic functionality', () => {
  let history
  let persistor
  let store
  let app: ReactElement
  let fx: ReturnType<typeof makeFx>

  beforeAll(() => {
    history = createBrowserHistory()
    ;({ persistor, store } = createPersistentStore(api, history))
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
    const searchQuery = fx.usersSearchQuery
    const queryResult = fx.usersSearchResultResponseBody
    const { login: userLogin, id: userId } = fx.usersSearchResultResponseBody.items[0]
    const userData = fx.users[userId]
    const { name: userName, bio: userBio } = fx.users[userId]
    const userReposPage = fx.singleReposPage

      //eslint-disable-next-line no-extra-semi
    ;(api.searchUser as jest.Mock).mockResolvedValueOnce(queryResult)
    ;(api.fetchUser as jest.Mock).mockResolvedValueOnce(userData)
    const pager = new ReposPager('this is mock')
    const pagerNextResult: IteratorResult<ReposPage, ReposPage> = {
      done: true,
      value: userReposPage
    }
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResult)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)

    //eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { getByLabelText, getByText, debug } = render(app)
    const searchInput = getByLabelText('Search user')
    const searchButton = getByText(/^search$/i)
    fireEvent.change(searchInput, {
      target: {
        value: searchQuery
      }
    })
    fireEvent.click(searchButton)
    await waitForElement(() => queryResult.items.map(item => getByText(item.login)))

    fireEvent.click(getByText(userLogin))
    await waitForElement(() => [getByText(userName!), getByText(userBio!)])
  })
})
