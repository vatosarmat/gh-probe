import { combineReducers } from 'redux'
import { all, call } from 'redux-saga/effects'

import Api from 'concepts/api'
import layout, { layoutActions } from './layout'
import repos, { fetchReposActions, saga as reposSaga } from './repos'
import user, { fetchUserActions, saga as userSaga } from './user'
import searchUsers, { searchUsersActions, saga as searchUsersSaga } from './search'

export function* rootSaga() {
  if (!process.env.GITHUB_TOKEN) {
    throw Error('No GITHUB_TOKEN in env')
  }

  const api = new Api(process.env.GITHUB_TOKEN)

  yield all([call(reposSaga, api), call(userSaga, api), call(searchUsersSaga, api)])
}

export default combineReducers({ layout, repos, user, searchUsers })
export { layoutActions, fetchReposActions, fetchUserActions, searchUsersActions }
