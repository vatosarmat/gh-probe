import { combineReducers } from 'redux'
import { all, call } from 'redux-saga/effects'

import Api from 'concepts/api'
import layout, { layoutActions, LayoutState } from './layout'
import repos, { fetchReposActions, saga as reposSaga, ReposState } from './repos'
import user, { fetchUserActions, saga as userSaga, UserState } from './user'
import searchUsers, {
  searchUsersActions,
  saga as searchUsersSaga,
  SearchUsersState
} from './search'

export function* rootSaga(api: Api) {
  yield all([call(reposSaga, api), call(userSaga, api), call(searchUsersSaga, api)])
}

export interface State {
  readonly layout: LayoutState
  readonly repos: ReposState
  readonly user: UserState
  readonly searchUsers: SearchUsersState
}

export default combineReducers({ layout, repos, user, searchUsers })

//layout
const { setReposPerPage, setPrimaryColor } = layoutActions

export { setReposPerPage, setPrimaryColor }

export function getReposPerPage(state: State) {
  return state.layout.reposPerPage
}

export function getPrimaryColor(state: State) {
  return state.layout.primaryColor
}

//searchUsers
const { request: searchUsersRequest } = searchUsersActions

export { searchUsersRequest }

export function getSearchUsersQuery(state: State) {
  return state.searchUsers.query
}

export function getSearchUsersResult(state: State) {
  return state.searchUsers.result
}

export function getSearchUsersInProgress(state: State) {
  return state.searchUsers.inProgress
}

export function getSearchUsersError(state: State) {
  return state.searchUsers.error
}

//fetchUser

//fetchRepos
