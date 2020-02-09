import { call, put, take, race, getContext } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { ReposPage } from 'services/api'
import { SagaContext } from 'state/helpers'

import { reposActions } from './reducer'

const { start, pageReady, abort: abortAction, error: errorAction } = reposActions

type RequestAction = ReturnType<typeof start>

function* fetchRepos({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')
  const fetcher = yield call(api.fetchRepos, username)

  try {
    let done = false
    while (!done) {
      let result: IteratorResult<ReposPage, ReposPage> = yield call(fetcher.next)
      const repos = result.value.repos.filter(repo => !repo.fork)
      yield put(pageReady({ ...result.value, repos }))

      done = Boolean(result.done)
    }
  } catch (error) {
    yield put(errorAction(error))
  }
}

export default function*() {
  while (true) {
    const action = yield take(getType(start))

    yield race([call(fetchRepos, action), take(getType(abortAction))])
  }
}
