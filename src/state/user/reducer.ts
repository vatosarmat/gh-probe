import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { User } from 'services/api'

export interface UserState {
  readonly data: User | null
  readonly isFetching: boolean
  readonly error: Error | null
}

const defaultState: UserState = {
  data: null,
  isFetching: false,
  error: null
}

export const fetchUserActions = createAsyncAction('user/REQUEST', 'user/SUCCESS', 'user/FAILURE')<
  string,
  User,
  Error
>()

type RootAction = ActionType<typeof fetchUserActions> | { type: 'RESET' }

export default createReducer<UserState, RootAction>(defaultState, {
  RESET: () => defaultState,

  'user/REQUEST': () => ({
    ...defaultState,
    isFetching: true
  }),

  'user/SUCCESS': (state, { payload }) => ({
    ...state,
    data: payload,
    isFetching: false,
    error: null
  }),

  'user/FAILURE': (state, { payload }) => ({
    ...state,
    isFetching: false,
    error: payload
  })
})
