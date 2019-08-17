import { call, put, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { fetchUserActions } from './reducer'
import Api from 'api'

const { request, success, failure } = fetchUserActions

type RequestAction = ReturnType<typeof request>

function* fetchUser(api: Api, { payload: username }: RequestAction) {
  try {
    const userData = yield call(api.fetchUser, username)

    yield put(success(userData))
  } catch (error) {
    yield put(failure(error))
  }
}

export default function*(api: Api) {
  yield takeLatest(getType(request), fetchUser, api)
}
