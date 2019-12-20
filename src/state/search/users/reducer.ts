import { DeepReadonly } from 'utility-types'
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { omit } from 'lodash'

import { UserBrief } from 'services/api'

export type SearchUsersState = DeepReadonly<{
  query?: string
  result?: UserBrief[]
  inProgress: boolean
  error?: string
}>

export const defaultSearchUserState: SearchUsersState = {
  inProgress: false
}

export const searchUsersActions = createAsyncAction(
  'search/users/REQUEST',
  'search/users/SUCCESS',
  'search/users/FAILURE'
)<string, UserBrief[], Error>()

type RootAction = ActionType<typeof searchUsersActions>

export default createReducer<SearchUsersState, RootAction>(defaultSearchUserState, {
  'search/users/REQUEST': (state, { payload: query }) => ({
    ...defaultSearchUserState,
    query,
    inProgress: true
  }),

  'search/users/SUCCESS': (state, { payload: result }) =>
    omit(
      {
        ...state,
        result,
        inProgress: false
      },
      ['error']
    ),

  'search/users/FAILURE': (state, { payload: error }) => ({
    ...state,
    inProgress: false,
    error: error.toString()
  })
})
