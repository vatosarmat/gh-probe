import { CANCEL } from 'redux-saga'
import { call, put, cancelled, take, race } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { fetchReposActions } from './reducer'
import Api, { Repo, ReposPage } from 'services/api'

const { start, pageReady, abort, aborted: fetchAborted, error: fetchError, complete: fetchComplete } = fetchReposActions

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

export default function*(api: Api) {
  while (true) {
    const action = yield take(getType(start))

    yield race([call(fetchRepos, api, action), take(getType(abort))])
  }
}
