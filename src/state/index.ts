import { combineReducers } from 'redux'
import { all, call } from 'redux-saga/effects'

import Api from 'services/api'
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

//common
export function resetState() {
  return { type: 'RESET' }
}

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

const { request: fetchUserRequest } = fetchUserActions

export { fetchUserRequest }

export function getUserData(state: State) {
  return state.user.data
}

export function getUserIsFetching(state: State) {
  return state.user.isFetching
}

export function getUserError(state: State) {
  return state.user.error
}

//fetchRepos

const { start: fetchReposStart, abort: fetchReposAbort } = fetchReposActions

export { fetchReposStart, fetchReposAbort }

export function getReposUsername(state: State) {
  return state.repos.username
}

export function getReposItems(state: State) {
  return state.repos.items
}

export function getReposProgress(state: State) {
  return state.repos.progress
}

export function getReposStatus(state: State) {
  return state.repos.status
}

export function getReposError(state: State) {
  return state.repos.error
}
