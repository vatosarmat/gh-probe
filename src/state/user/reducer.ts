import { DeepReadonly } from 'utility-types'
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { omit } from 'lodash'

import { User } from 'services/api'

export type UserState = DeepReadonly<{
  data?: User
  isFetching: boolean
  error?: string
}>

const defaultUserState: UserState = {
  isFetching: false
}

export const fetchUserActions = createAsyncAction('user/REQUEST', 'user/SUCCESS', 'user/FAILURE')<string, User, Error>()

type RootAction = ActionType<typeof fetchUserActions>

export default createReducer<UserState, RootAction>(defaultUserState, {
  'user/REQUEST': () => ({
    ...defaultUserState,
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

  'user/FAILURE': (state, { payload: error }) =>
    omit(
      {
        ...state,
        isFetching: false,
        error: error.toString()
      },
      ['data']
    )
})
