import { call, put, cancelled, take, race, getContext } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { Repo, ReposPage } from 'services/api'
import { SagaContext } from 'state/helpers'

import { reposActions } from './reducer'

const { start, pageReady, abort, aborted: fetchAborted, error: fetchError, complete: fetchComplete } = reposActions

type RequestAction = ReturnType<typeof start>

function* fetchRepos({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')
  const items: Repo[] = []
  const fetcher = yield call(api.fetchRepos, username)

  try {
    while (true) {
      const {
        done,
        value: { repos, current, total }
      }: IteratorResult<ReposPage, ReposPage> = yield call(fetcher.next)

      items.push(...repos.filter(repo => !repo.fork))

      if (done) {
        break
      }

      yield put(pageReady({ current, total }))
    }

    yield put(fetchComplete(items))
  } catch (error) {
    yield put(fetchError(error, items))
  } finally {
    if (yield cancelled()) {
      yield put(fetchAborted(items))
    }
  }
}

export default function*() {
  while (true) {
    const action = yield take(getType(start))

    yield race([call(fetchRepos, action), take(getType(abort))])
  }
}
