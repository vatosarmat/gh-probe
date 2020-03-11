import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { render, fireEvent, waitForElement } from '@testing-library/react'

import { createTestStore } from 'state'
import { searchUser } from 'services/api'
import Search from 'components/Search'

import makeFx from 'services/api/fixtures'

jest.mock('services/api')

describe('Search page', () => {
  let store
  let searchPage: ReactElement
  let fx: ReturnType<typeof makeFx>

  beforeAll(() => {
    store = createTestStore()
    searchPage = (
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    )
    fx = makeFx()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Search user by input query and click search button', () => {
    // eslint-disable-next-line no-extra-semi
    ;(searchUser as jest.Mock).mockResolvedValueOnce(fx.usersSearchResult)

    const { getByLabelText, getByText } = render(searchPage)
    const searchInput = getByLabelText('Search user')
    const searchButton = getByText(/^search$/i)
    fireEvent.change(searchInput, {
      target: {
        value: fx.usersSearchQuery
      }
    })
    fireEvent.click(searchButton)
    return waitForElement(() => fx.usersSearchResult.map(item => getByText(item.login)))
  })
})
