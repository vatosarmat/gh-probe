import { CANCEL } from 'redux-saga'
import { call, put, cancelled, take, race, getContext } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { Repo, ReposPage } from 'services/api'
import { SagaContext } from 'state/helpers'

import { fetchReposActions } from './reducer'

const { start, pageReady, abort, aborted: fetchAborted, error: fetchError, complete: fetchComplete } = fetchReposActions

type RequestAction = ReturnType<typeof start>

function* fetchRepos({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')
  const repos: Repo[] = []
  const fetcher = api.fetchRepos(username)

  const nextPage = () => {
    const prom = fetcher.next()
    //@ts-ignore
    prom[CANCEL] = fetcher.abort
    return prom
  }

  try {
    while (true) {
      const {
        done,
        value: { repos, current, total }
      }: IteratorResult<ReposPage, ReposPage> = yield call(nextPage)

      repos.push(...repos.filter(repo => !repo.fork))

      if (done) {
        break
      }

      yield put(pageReady({ current, total }))
    }

    yield put(fetchComplete(repos))
  } catch (error) {
    yield put(fetchError(error, repos))
  } finally {
    if (yield cancelled()) {
      yield put(fetchAborted(repos))
    }
  }
}

export default function*() {
  while (true) {
    const action = yield take(getType(start))

    yield race([call(fetchRepos, action), take(getType(abort))])
  }
}
