import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions'
import { omit, keyBy } from 'lodash-es'

import { SearchUserResultItem } from 'services/api'
import { DeepReadonly } from 'utils/common'

export type UsersSearchState = DeepReadonly<{
  query?: string
  result: Record<string, SearchUserResultItem>
  inProgress: boolean
  error?: string
}>

export const defaultUsersSearchState: UsersSearchState = {
  inProgress: false,
  result: {}
}

export const usersSearchActions = createAsyncAction(
  'usersSearch/REQUEST',
  'usersSearch/SUCCESS',
  'usersSearch/FAILURE'
)<string, SearchUserResultItem[], Error>()

export type UsersSearchAction = ActionType<typeof usersSearchActions>

export default createReducer<UsersSearchState, UsersSearchAction>(defaultUsersSearchState, {
  'usersSearch/REQUEST': (state, { payload: query }) => ({
    ...defaultUsersSearchState,
    query,
    inProgress: true
  }),

  'usersSearch/SUCCESS': (state, { payload: resultArray }) =>
    omit(
      {
        ...state,
        result: {
          ...state.result,
          ...keyBy(resultArray, 'id')
        },
        inProgress: false
      },
      ['error']
    ),

  'usersSearch/FAILURE': (state, { payload: error }) => ({
    ...state,
    inProgress: false,
    error: error.toString()
  })
})
