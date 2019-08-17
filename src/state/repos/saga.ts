import { CANCEL } from 'redux-saga'
import { call, put, cancelled, take, race } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { fetchReposActions } from './reducer'
import Api, { Repo, ReposPage } from 'api'

const { start, pageReady, abort, complete } = fetchReposActions

type RequestAction = ReturnType<typeof start>

function* fetchRepos(api: Api, { payload: username }: RequestAction) {
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
      const { current, total, done, value: items }: ReposPage = yield call(nextPage)

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
  } finally {
    if (yield cancelled()) {
      yield put(
        complete({
          items: repos,
          status: 'ABORTED',
          error: null
        })
      )
    }
  }
}

export default function*(api: Api) {
  while (true) {
    const action = yield take(getType(start))

    yield race([call(fetchRepos, api, action), take(getType(abort))])
  }
}
