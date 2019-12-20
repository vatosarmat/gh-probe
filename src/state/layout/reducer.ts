import { DeepReadonly } from 'utility-types'
import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { ReposPerPage, PrimaryColor } from './config'

export type LayoutState = DeepReadonly<{
  reposPerPage: ReposPerPage
  primaryColor: PrimaryColor
}>

export const defaultLayoutState: LayoutState = {
  reposPerPage: 10,
  primaryColor: 'indigo'
}

export const layoutActions = {
  setReposPerPage: createAction('layout/SET_REPOS_PER_PAGE')<ReposPerPage>(),
  setPrimaryColor: createAction('layout/SET_PRIMARY_COLOR')<PrimaryColor>()
}

export type LayoutAction = ActionType<typeof layoutActions>

export default createReducer<LayoutState, LayoutAction>(defaultLayoutState, {
  'layout/SET_REPOS_PER_PAGE': (state, { payload }) => ({
    ...state,
    reposPerPage: payload
  }),

  'layout/SET_PRIMARY_COLOR': (state, { payload }) => ({
    ...state,
    primaryColor: payload
  })
})
