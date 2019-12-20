import { combineReducers, Action } from 'redux'
import { all, call } from 'redux-saga/effects'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

import layout, { LayoutState, defaultLayoutState } from './layout'
import repos, { ReposState, defaultReposState, reposSaga } from './repos'
import user, { UserState, defaultUserState, userSaga } from './user'
import usersSearch, { UsersSearchState, defaultUsersSearchState, usersSearchSaga } from './usersSearch'

export * from './helpers'
export { layoutActions, layoutSelectors } from './layout'
export { userActions } from './user'
export { usersSearchActions } from './usersSearch'
export { reposActions } from './repos'

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

export default function rootReducer(state: State | undefined, action: Action) {
  if (action.type === 'RESET') {
    return defaultState
  }

  return fieldsReducer(state, action)
}

// function makePersistedReducer() {
//   function persistSession() {
//     const blacklist: (keyof SessionState)[] = ['authorize', 'logout']

//     return persistReducer(
//       {
//         key: 'session',
//         storage,
//         blacklist
//       },
//       session
//     )
//   }

//   const rootReducer = combineReducers({ session: persistSession(), posts, ui })

//   return persistReducer({ key: 'root', storage }, rootReducer)
// }

// export const persistedReducer = makePersistedReducer()
