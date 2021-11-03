import { call, put, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { searchUser, SearchUserResultItem } from 'services/api'

import { usersSearchActions } from './reducer'

const { request, success, failure } = usersSearchActions

type RequestAction = ReturnType<typeof request>

function* usersSearch({ payload: query }: RequestAction) {
  try {
    const searchResult: SearchUserResultItem[] = yield call(searchUser, query)

    yield put(success(searchResult))
  } catch (error) {
    yield put(failure(error as Error))
  }
}

export default function* () {
  yield takeLatest(getType(request), usersSearch)
}
