import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { omit } from 'lodash'

import { DeepReadonly } from 'utils/common'
import { User } from 'services/api'

export type UserState = DeepReadonly<{
  query?: string
  data?: User
  isFetching: boolean
  error?: string
}>

export const defaultUserState: UserState = {
  isFetching: false
}

export const userActions = createAsyncAction('user/REQUEST', 'user/SUCCESS', 'user/FAILURE')<string, User, Error>()

export type UserAction = ActionType<typeof userActions>

export default createReducer<UserState, UserAction>(defaultUserState, {
  'user/REQUEST': (state, { payload: query }) => ({
    ...defaultUserState,
    query,
    isFetching: true
  }),

  'user/SUCCESS': (state, { payload: user }) =>
    omit(
      {
        ...state,
        data: user,
        isFetching: false
      },
      ['error']
    ),

  'user/FAILURE': (state, { payload: error }) => ({
    ...state,
    isFetching: false,
    error: error.toString()
  })
})
