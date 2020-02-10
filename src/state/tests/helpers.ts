import { ActionType } from 'typesafe-actions'
import { END } from 'redux-saga'
import { call, setContext, Effect } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'

import rootReducer, { State, rootSaga } from 'state'
import { userActions } from 'state/user'
import { usersSearchActions } from 'state/usersSearch'
import { reposActions } from 'state/repos'
import { SagaContext } from 'state/helpers'
import { Api } from 'services/api'
import { isNumber } from 'utils/common'
import 'utils/testing'

jest.mock('services/api')

export const api = new Api('THIS IS MOCK')

export function* runSagaTest<Fn extends (...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>) {
  const sagaContext: SagaContext = {
    api
  }

  yield setContext(sagaContext)
  yield call(fn, ...args)
}

type AppUserDispatchableAction = ActionType<
  typeof userActions.request | typeof usersSearchActions.request | typeof reposActions.start | typeof reposActions.stop
>

export function expectSagaState({
  initialState,
  dispatchActions,
  expectedState,
  expectedEffects,
  unexpectedEffects
}: {
  initialState: State
  dispatchActions: (AppUserDispatchableAction | number)[]
  expectedState: State
  expectedEffects?: Effect[][]
  unexpectedEffects?: Effect[][]
}) {
  let expectChain = expectSaga(runSagaTest, rootSaga).withReducer(rootReducer, initialState)
  let totalDelay = 0
  expectChain = dispatchActions.reduce((chain, v) => {
    if (isNumber(v)) {
      totalDelay += v
      return chain.delay(v)
    }
    return chain.dispatch(v)
  }, expectChain)

  return expectChain
    .hasFinalState<State>(expectedState)
    .delay(totalDelay * 2 + 1)
    .dispatch(END)
    .run()
    .then(result => {
      if (expectedEffects && expectedEffects.length > 0) {
        for (const series of expectedEffects) {
          expect(result.allEffects).toIncludeAllMembersOrdered(series)
        }
      }
      if (unexpectedEffects && unexpectedEffects.length > 0) {
        for (const series of unexpectedEffects) {
          expect(result.allEffects).not.toIncludeAllMembersOrdered(series)
        }
      }
    })
}
