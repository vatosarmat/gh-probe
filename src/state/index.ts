import { combineReducers, Action } from 'redux'
import { all, call } from 'redux-saga/effects'
import { persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import layout, { LayoutState, defaultLayoutState } from './layout'
import repos, { ReposState, defaultReposState, reposSaga } from './repos'
import user, { UserState, defaultUserState, userSaga } from './user'
import usersSearch, { UsersSearchState, defaultUsersSearchState, usersSearchSaga } from './usersSearch'

export * from './helpers'
export * from './layout'
export * from './user'
export * from './usersSearch'
export * from './repos'

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

const transform = createTransform(undefined, (stateSlice: State[keyof State], key: keyof State, state: State) => {
  console.log(key)
  console.log(stateSlice)

  switch (key) {
    case 'repos': {
      const repos = stateSlice as ReposState

      return {
        ...repos,
        status: repos.status === 'IN_PROGRESS' ? 'STOPPED' : repos.status
      }
    }
    case 'user': {
      const user = stateSlice as UserState

      return user.isFetching ? { ...defaultUserState } : user
    }
    case 'usersSearch': {
      const usersSearch = stateSlice as UsersSearchState

      return usersSearch.inProgress ? defaultUsersSearchState : usersSearch
    }
    default:
      return stateSlice
  }
})

export const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    transforms: [transform]
  },
  rootReducer
)
