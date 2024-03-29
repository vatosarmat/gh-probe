import { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { render, fireEvent, waitFor } from '@testing-library/react'

import { createTestStore } from 'state'
import { searchUser } from 'services/api'
import Search from 'components/Search'
import { appConfig } from 'config'

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
    return waitFor(() => fx.usersSearchResult.map(item => getByText(item.login)))
  })

  it('Examples and search modifiers', () => {
    const exampleUser = appConfig.exampleUsers[0]

    const { getByLabelText, getByText } = render(searchPage)
    const searchInput = getByLabelText(appConfig.searchUserLabel)
    const exampleCaption = getByText(exampleUser)
    const modifierLink = getByText('in:login')

    fireEvent.click(exampleCaption)
    fireEvent.click(modifierLink)
    expect(searchInput).toHaveValue(`${exampleUser} in:login`)
  })

  it('Show tooltip if empty input', () => {
    const { getByLabelText, getByText } = render(searchPage)
    const searchInput = getByLabelText(appConfig.searchUserLabel)
    fireEvent.change(searchInput, {
      target: {
        value: '    '
      }
    })
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 })

    return waitFor(() => getByText(appConfig.emptySearchQueryTooltip))
  })
})
