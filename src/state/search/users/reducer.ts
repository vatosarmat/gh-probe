import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { UserBrief } from 'concepts/api'

export interface SearchUsersState {
  readonly result: UserBrief[]
  readonly inProgress: boolean
  readonly error: Error | null
}

const defaultState: SearchUsersState = {
  result: [],
  inProgress: false,
  error: null
}

export const searchUsersActions = createAsyncAction(
  'search/users/REQUEST',
  'search/users/SUCCESS',
  'search/users/FAILURE'
)<string, UserBrief[], Error>()

type RootAction = ActionType<typeof searchUsersActions>

export default createReducer<SearchUsersState, RootAction>(defaultState, {
  'search/users/REQUEST': () => ({
    ...defaultState,
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
