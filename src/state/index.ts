import { combineReducers, Action } from 'redux'
import { all, call } from 'redux-saga/effects'

import layout, { LayoutState, defaultLayoutState } from './layout'
import repos, { ReposState, defaultReposState, reposSaga } from './repos'
import user, { UserState, defaultUserState, userSaga } from './user'
import usersSearch, { UsersSearchState, defaultUsersSearchState, usersSearchSaga } from './usersSearch'

export function* rootSaga() {
  yield all([call(reposSaga), call(userSaga), call(usersSearchSaga)])
}

export interface State {
  readonly layout: LayoutState
  readonly repos: ReposState
  readonly user: UserState
  readonly usersSearch: UsersSearchState
}

export const defaultState: State = {
  layout: defaultLayoutState,
  repos: defaultReposState,
  user: defaultUserState,
  usersSearch: defaultUsersSearchState
}

export const rootActions = {
  reset: () => ({ type: 'RESET' })
}

const fieldsReducer = combineReducers<State>({ layout, repos, user, usersSearch })

export default function rootReducer(state: State, action: Action) {
  if (action.type === 'RESET') {
    return defaultState
  }

  return fieldsReducer(state, action)
}
