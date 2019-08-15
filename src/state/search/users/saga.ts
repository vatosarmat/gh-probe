import { call, put, takeLatest, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { searchUsersActions } from './reducer'
import Api from 'api'

const { request, success, failure } = searchUsersActions

type RequestAction = ReturnType<typeof request>

function* searchUser(api: Api, { payload: query }: RequestAction) {
  try {
    const data = yield call(api.fetchUser, query)
  } catch (error) {
    yield put(failure(error))
  } finally {
  }
}

export default function*(api: Api) {
  yield takeLatest(getType(searchUsersActions.request), searchUser, api)
}
