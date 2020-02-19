import { call, put, take, race, getContext, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { ReposPage, ReposPager } from 'services/api'
import { SagaContext } from 'state/helpers'

import { reposActions, ReposState } from './reducer'

const { start, pageReady, stop, resume, error: errorAction } = reposActions

type RequestAction = ReturnType<typeof start>

const getNextUrl = ({ repos }: { repos: ReposState }) => repos.progress?.nextUrl

function* resumeFetch(reposPager?: ReposPager) {
  try {
    if (!reposPager) {
      const nextUrl: ReturnType<typeof getNextUrl> = yield select(getNextUrl)
      if (!nextUrl) {
        throw Error('Invalid state')
      }
      reposPager = new ReposPager(nextUrl)
    }

    let done = false
    while (!done) {
      let result: IteratorResult<ReposPage, ReposPage> = yield call(reposPager.next)
      const repos = result.value.repos.filter(repo => !repo.fork)
      yield put(pageReady({ ...result.value, repos }))

      done = Boolean(result.done)
    }
  } catch (error) {
    yield put(errorAction(error))
  }
}

function* startFetch({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')
  const reposPager: ReposPager = yield call(api.fetchRepos, username)

  yield call(resumeFetch, reposPager)
}

export default function*() {
  while (true) {
    const action = yield take([getType(start), getType(resume)])

    switch (action.type) {
      case getType(start):
        yield race([call(startFetch, action), take(getType(stop))])
        break
      case getType(resume):
        yield race([call(resumeFetch), take(getType(stop))])
        break
    }
  }
}
