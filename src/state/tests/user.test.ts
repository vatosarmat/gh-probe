import { call, put } from 'redux-saga/effects'
import { cloneDeep } from 'lodash'

import { userActions, State } from 'state'
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
    const expectedUser = fx.usersArray[0]
    ;(api.fetchUser as jest.Mock).mockResolvedValueOnce(expectedUser)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.user.query = expectedUser.login
    expectedState.user.data = expectedUser

    return expectSagaState({
      initialState,
      dispatchActions: [userActions.request(expectedUser.login!)],
      expectedState,
      expectedEffects: [[call(api.fetchUser, expectedUser.login!), put(userActions.success(expectedUser))]]
    })
  })

  it('Network error', () => {
    const user = fx.usersArray[0]
    ;(api.fetchUser as jest.Mock).mockRejectedValueOnce(fx.networkError)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.user.query = user.login
    expectedState.user.error = fx.networkError.toString()

    return expectSagaState({
      initialState,
      dispatchActions: [userActions.request(user.login!)],
      expectedState,
      expectedEffects: [[call(api.fetchUser, user.login!), put(userActions.failure(fx.networkError))]]
    })
  })
})
