import { call, put } from 'redux-saga/effects'
import { cloneDeep, keyBy } from 'lodash-es'

import { searchUser } from 'services/api'
import { usersSearchActions, State } from 'state'
import { Mutable } from 'utils/common'
import makeFx from 'services/api/fixtures'
import { expectSagaState } from './helpers'

jest.mock('services/api')

describe('Fetch user data', () => {
  let fx: ReturnType<typeof makeFx>
  beforeEach(() => {
    fx = makeFx()
    jest.resetAllMocks()
  })

  it('Success', () => {
    // eslint-disable-next-line no-extra-semi
    ;(searchUser as jest.Mock).mockResolvedValueOnce(fx.usersSearchResult)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.usersSearch.query = fx.usersSearchQuery
    expectedState.usersSearch.result = keyBy(fx.usersSearchResult, 'id')

    return expectSagaState({
      initialState,
      dispatchActions: [usersSearchActions.request(fx.usersSearchQuery)],
      expectedState,
      expectedEffects: [[call(searchUser, fx.usersSearchQuery), put(usersSearchActions.success(fx.usersSearchResult))]]
    })
  })

  it('Network error', () => {
    // eslint-disable-next-line no-extra-semi
    ;(searchUser as jest.Mock).mockRejectedValueOnce(fx.networkError)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.usersSearch.query = fx.usersSearchQuery
    expectedState.usersSearch.error = fx.networkError.toString()

    return expectSagaState({
      initialState,
      dispatchActions: [usersSearchActions.request(fx.usersSearchQuery)],
      expectedState,
      expectedEffects: [[call(searchUser, fx.usersSearchQuery), put(usersSearchActions.failure(fx.networkError))]]
    })
  })
})
