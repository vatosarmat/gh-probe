import { DeepReadonly } from 'utility-types'
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { omit } from 'lodash'

import { UserBrief } from 'services/api'

export type UsersSearchState = DeepReadonly<{
  query?: string
  result?: UserBrief[]
  inProgress: boolean
  error?: string
}>

export const defaultUsersSearchState: UsersSearchState = {
  inProgress: false
}

export const usersSearchActions = createAsyncAction(
  'search/users/REQUEST',
  'search/users/SUCCESS',
  'search/users/FAILURE'
)<string, UserBrief[], Error>()

export type UsersSearchAction = ActionType<typeof usersSearchActions>

export default createReducer<UsersSearchState, UsersSearchAction>(defaultUsersSearchState, {
  'search/users/REQUEST': (state, { payload: query }) => ({
    ...defaultUsersSearchState,
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
