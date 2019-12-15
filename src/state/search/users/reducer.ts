import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { UserBrief } from 'services/api'

export interface SearchUsersState {
  readonly query: string
  readonly result: UserBrief[] | null
  readonly inProgress: boolean
  readonly error: Error | null
}

const defaultState: SearchUsersState = {
  query: '',
  result: null,
  inProgress: false,
  error: null
}

export const searchUsersActions = createAsyncAction(
  'search/users/REQUEST',
  'search/users/SUCCESS',
  'search/users/FAILURE'
)<string, UserBrief[], Error>()

type RootAction = ActionType<typeof searchUsersActions> | { type: 'RESET' }

export default createReducer<SearchUsersState, RootAction>(defaultState, {
  RESET: () => defaultState,

  'search/users/REQUEST': (state, { payload }) => ({
    ...defaultState,
    query: payload,
    inProgress: true
  }),

  'search/users/SUCCESS': (state, { payload }) => ({
    ...state,
    result: payload,
    inProgress: false,
    error: null
  }),

  'search/users/FAILURE': (state, { payload }) => ({
    ...state,
    inProgress: false,
    error: payload
  })
})
