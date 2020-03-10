import { ActionType } from 'typesafe-actions'
import { END } from 'redux-saga'
import { Effect } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'

import rootReducer, { State, rootSaga } from 'state'
import { usersSearchActions } from 'state/usersSearch'
import { reposActions } from 'state/repos'
import { isNumber } from 'utils/common'

type AppUserDispatchableAction = ActionType<
  typeof usersSearchActions.request | typeof reposActions.start | typeof reposActions.stop | typeof reposActions.resume
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
  let expectChain = expectSaga(rootSaga).withReducer(rootReducer, initialState)
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
