import { call, put, takeLatest, getContext } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { SearchResult, UserBrief } from 'services/api'
import { SagaContext } from 'state/helpers'

import { searchUsersActions } from './reducer'

const { request, success, failure } = searchUsersActions

type RequestAction = ReturnType<typeof request>

function* searchUser({ payload: query }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')

  try {
    const searchResult: SearchResult<UserBrief> = yield call(api.searchUser, query)

    yield put(success(searchResult.items))
  } catch (error) {
    yield put(failure(error))
  }
}

export default function*() {
  yield takeLatest(getType(request), searchUser)
}
