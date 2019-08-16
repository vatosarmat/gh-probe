import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { UserBrief } from 'api'

export interface State {
  readonly result: UserBrief[]
  readonly inProgress: boolean
  readonly error: Error | null
}

const defaultState: State = {
  result: [],
  inProgress: false,
  error: null
}

export const searchUsersActions = createAsyncAction(
  'search/user/REQUEST',
  'search/user/SUCCESS',
  'search/user/FAILURE'
)<string, UserBrief[], Error>()

type RootAction = ActionType<typeof searchUsersActions>

export default createReducer<State, RootAction>(defaultState, {
  'search/user/REQUEST': () => ({
    ...defaultState,
    inProgress: true
  }),

  'search/user/SUCCESS': (state, { payload }) => ({
    ...state,
    result: payload,
    inProgress: false,
    error: null
  }),

  'search/user/FAILURE': (state, { payload }) => ({
    ...state,
    inProgress: false,
    error: payload
  })
})
