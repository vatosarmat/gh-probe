import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { User } from 'concepts/api'

export interface State {
  readonly data: User | null
  readonly isFetching: boolean
  readonly error: Error | null
}

const defaultState: State = {
  data: null,
  isFetching: false,
  error: null
}

export const fetchUserActions = createAsyncAction('user/REQUEST', 'user/SUCCESS', 'user/FAILURE')<
  string,
  User,
  Error
>()

type RootAction = ActionType<typeof fetchUserActions>

export default createReducer<State, RootAction>(defaultState, {
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
