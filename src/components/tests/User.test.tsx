import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'

import { render, waitForElement } from '@testing-library/react'

import { createTestStore } from 'state'
import { fetchUserAndRepos, fetchReposAfterCursor } from 'services/api'
import User from 'components/User'

import makeFx from 'services/api/fixtures'

jest.mock('services/api')

describe('User page', () => {
  let fx: ReturnType<typeof makeFx>

  const renderUserPage = (login: string) => {
    return render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={[`/users/${login}`]} initialIndex={0}>
          <Route path="/users/:login" component={User} />
        </MemoryRouter>
      </Provider>
    )
  }

  beforeAll(() => {
    fx = makeFx()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Fetch userData and repos; display them', async () => {
    const expectedUserData = fx.users[1]
    ;(fetchUserAndRepos as jest.Mock).mockResolvedValueOnce([expectedUserData, fx.multipleRepoPages[0]])
    ;(fetchReposAfterCursor as jest.Mock).mockResolvedValueOnce(fx.multipleRepoPages[1])

    const { getByText } = renderUserPage(expectedUserData.login)

    return waitForElement(() => [
      getByText(expectedUserData.name!),
      getByText(expectedUserData.bio!),
      ...fx.multipleRepoPages.map(item => getByText(item.repos[0].name))
    ])
  })
})
