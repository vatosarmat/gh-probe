import { call, put, take, race, getContext, fork, all, join } from 'redux-saga/effects'
import { Task } from 'redux-saga'
import { getType } from 'typesafe-actions'
import { zipWith } from 'lodash'

import { ReposPage } from 'services/api'
import { SagaContext } from 'state/helpers'

import { reposActions, ExtendedReposPage } from './reducer'

const { start, pageReady, abort: abortAction, error: errorAction } = reposActions

type RequestAction = ReturnType<typeof start>

function* processReposPage(reposPage: ReposPage) {
  const api: SagaContext['api'] = yield getContext('api')

  const filteredRepos = reposPage.repos.filter(repo => !repo.fork)

  const lcds: string[] = yield all(filteredRepos.map(repo => call(api.fetchLastCommitDate, repo)))

  const extendedReposPage: ExtendedReposPage = {
    ...reposPage,
    repos: zipWith(filteredRepos, lcds, (repo, lcd) => Object.assign(repo, { last_commit_date: lcd }))
  }

  yield put(pageReady(extendedReposPage))
}

function* fetchRepos({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')
  const fetcher = yield call(api.fetchRepos, username)

  try {
    let result: IteratorResult<ReposPage, ReposPage> = yield call(fetcher.next)
    let pageTask: Task = yield fork(processReposPage, result.value)
    let done = Boolean(result.done)

    while (!done) {
      result = yield call(fetcher.next)
      yield join(pageTask)
      pageTask = yield fork(processReposPage, result.value)
      done = Boolean(result.done)
    }

    yield join(pageTask)
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
