import { call, put, take, race, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { ReposPage, User, fetchUserAndRepos, fetchReposAfterCursor } from 'services/api'

import { reposActions, ReposState } from './reducer'

const { start, userDataReady, pageReady, stop, resume, error: errorAction } = reposActions

type RequestStart = ReturnType<typeof start>
type RequestResume = ReturnType<typeof resume>

const getLastRepoCursor = ({ repos }: { repos: ReposState }) => repos.progress?.lastRepoCursor
const getRequestedUserLogin = ({ repos }: { repos: ReposState }) => repos.requestedUserLogin

function* startFetch({ payload: login }: RequestStart) {
  let reposPage
  let user
  try {
    const data: [User, ReposPage] = yield call(fetchUserAndRepos, login)
    ;[user, reposPage] = data

    yield put(userDataReady(user))
    yield put(pageReady(reposPage))
  } catch (error) {
    yield put(errorAction(error as Error))
  }

  if (reposPage?.hasNextPage) {
    yield call(resumeFetch)
  }
}

function* resumeFetch() {
  try {
    const login: string = yield select(getRequestedUserLogin)
    let lastRepoCursor: string = yield select(getLastRepoCursor)
    let reposPage: ReposPage

    do {
      reposPage = yield call(fetchReposAfterCursor, login, lastRepoCursor)
      lastRepoCursor = reposPage.lastRepoCursor

      yield put(pageReady(reposPage))
    } while (reposPage.hasNextPage)
  } catch (error) {
    yield put(errorAction(error as Error))
  }
}

export default function* () {
  while (true) {
    const action: RequestStart | RequestResume = yield take([getType(start), getType(resume)])

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
