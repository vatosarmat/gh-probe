import { call, put } from 'redux-saga/effects'
import { cloneDeep } from 'lodash'

import { usersSearchActions, State } from 'state'
import { Mutable } from 'utils/common'
import makeFx from '../../services/api/fixtures'
import { expectSagaState, api } from './helpers'

describe('Fetch user data', () => {
  let fx: ReturnType<typeof makeFx>
  beforeEach(() => {
    fx = makeFx()
    jest.resetAllMocks()
  })

  it('Success', () => {
    const usersSearchResultRB = fx.usersSearchResultResponseBody
    ;(api.searchUser as jest.Mock).mockResolvedValueOnce(usersSearchResultRB)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.usersSearch.query = fx.usersSearchQuery
    expectedState.usersSearch.result = fx.usersSearchResult

    return expectSagaState({
      initialState,
      dispatchActions: [usersSearchActions.request(fx.usersSearchQuery)],
      expectedState,
      expectedEffects: [
        [call(api.searchUser, fx.usersSearchQuery), put(usersSearchActions.success(usersSearchResultRB.items))]
      ]
    })
  })

  it('Network error', () => {
    // eslint-disable-next-line no-extra-semi
    ;(api.searchUser as jest.Mock).mockRejectedValueOnce(fx.networkError)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.usersSearch.query = fx.usersSearchQuery
    expectedState.usersSearch.error = fx.networkError.toString()

    return expectSagaState({
      initialState,
      dispatchActions: [usersSearchActions.request(fx.usersSearchQuery)],
      expectedState,
      expectedEffects: [[call(api.searchUser, fx.usersSearchQuery), put(usersSearchActions.failure(fx.networkError))]]
    })
  })
})
