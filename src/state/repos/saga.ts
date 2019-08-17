import { call, put, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { fetchReposActions } from './reducer'
import Api, { Repo, ReposPage } from 'api'

const { start, pageReady, abort, complete } = fetchReposActions

type RequestAction = ReturnType<typeof start>

function* fetchRepos(api: Api, { payload: username }: RequestAction) {
  const repos: Repo[] = []
  const fetcher = api.fetchRepos(username)

  try {
    while (true) {
      const { current, total, done, value: items }: ReposPage = yield call(fetcher.next)

      repos.push(...items.filter(repo => !repo.fork))

      if (done) {
        break
      }

      yield put(pageReady({ current, total }))
    }

    yield put(
      complete({
        items: repos,
        status: 'FULL',
        error: null
      })
    )
  } catch (error) {
    yield put(
      complete({
        items: repos,
        status: 'ERROR',
        error
      })
    )
  }
}

export default function*(api: Api) {
  yield takeLatest(getType(start), fetchRepos, api)
}
