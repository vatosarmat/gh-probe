import { call, put, takeLatest, getContext } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { User } from 'services/api'
import { SagaContext } from 'state/helpers'

import { fetchUserActions } from './reducer'

const { request, success, failure } = fetchUserActions

type RequestAction = ReturnType<typeof request>

function* fetchUser({ payload: username }: RequestAction) {
  const api: SagaContext['api'] = yield getContext('api')

  try {
    const userData: User = yield call(api.fetchUser, username)

    yield put(success(userData))
  } catch (error) {
    yield put(failure(error))
  }
}

export default function*() {
  yield takeLatest(getType(request), fetchUser)
}
