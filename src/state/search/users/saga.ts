import { call, put, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { searchUsersActions } from './reducer'
import Api from 'concepts/api'

const { request, success, failure } = searchUsersActions

type RequestAction = ReturnType<typeof request>

function* searchUser(api: Api, { payload: query }: RequestAction) {
  try {
    const searchResult = yield call(api.searchUser, query)

    yield put(success(searchResult.items))
  } catch (error) {
    yield put(failure(error))
  }
}

export default function*(api: Api) {
  yield takeLatest(getType(request), searchUser, api)
}
