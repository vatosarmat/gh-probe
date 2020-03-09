import { applyMiddleware, createStore, combineReducers, Action } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { all, call } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import { persistReducer, persistStore, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { History } from 'history'

import layout, { LayoutState, defaultLayoutState } from './layout'
import repos, { ReposState, defaultReposState, reposSaga } from './repos'
import usersSearch, { UsersSearchState, defaultUsersSearchState, usersSearchSaga } from './usersSearch'

export * from './layout'
export * from './usersSearch'
export * from './repos'

export function* rootSaga() {
  yield all([call(reposSaga), call(usersSearchSaga)])
}

export interface State {
  readonly layout: LayoutState
  readonly repos: ReposState
  readonly usersSearch: UsersSearchState
}

export const defaultState: State = {
  layout: defaultLayoutState,
  repos: defaultReposState,
  usersSearch: defaultUsersSearchState
}

export const rootActions = {
  reset: () => ({ type: 'RESET' })
}

const fieldsReducer = combineReducers<State>({ layout, repos, usersSearch })

export default function rootReducer(state: State | undefined, action: Action) {
  if (action.type === 'RESET') {
    return defaultState
  }

  return fieldsReducer(state, action)
}

const transform = createTransform(undefined, (stateSlice: State[keyof State], key: keyof State, state: State) => {
  switch (key) {
    case 'repos': {
      const repos = stateSlice as ReposState

      if (repos.error) {
        return defaultReposState
      }

      return {
        ...repos,
        status: repos.status === 'IN_PROGRESS' ? 'STOPPED' : repos.status
      }
    }
    case 'usersSearch': {
      const usersSearch = stateSlice as UsersSearchState

      if (usersSearch.error || usersSearch.inProgress) {
        return defaultUsersSearchState
      }

      return usersSearch
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

export function createPersistentStore(history: History) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
  const persistor = persistStore(store, null, () => {
    const state = store.getState()
    const login = state.repos.userData?.login
    if (login) {
      history.replace(`/users/${login}`)
    }
  })

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
