import { Effect, call, put, take } from 'redux-saga/effects'
import { pick, cloneDeep } from 'lodash'

import { userActions, State } from 'state'
import { Mutable } from 'utils/common'
import makeFx from './fixtures'
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
    expectedState.user.data = expectedUser

    return expectSagaState({
      initialState,
      dispatchActions: [userActions.request(expectedUser.name!)],
      expectedState,
      expectedEffects: [[call(api.fetchUser, expectedUser.name!), put(userActions.success(expectedUser))]]
    })
  })

  it('Network error', () => {
    const user = fx.usersArray[0]
    ;(api.fetchUser as jest.Mock).mockRejectedValueOnce(fx.networkError)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.user.error = fx.networkError.toString()

    return expectSagaState({
      initialState,
      dispatchActions: [userActions.request(user.name!)],
      expectedState,
      expectedEffects: [[call(api.fetchUser, user.name!), put(userActions.failure(fx.networkError))]]
    })
  })
})
