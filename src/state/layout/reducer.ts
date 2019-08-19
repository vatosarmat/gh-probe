import { ActionType, createReducer, createStandardAction } from 'typesafe-actions'
import { ReposPerPage, PrimaryColor } from 'concepts/layout'

export interface LayoutState {
  reposPerPage: ReposPerPage
  primaryColor: PrimaryColor
}

const defaultState: LayoutState = {
  reposPerPage: 10,
  primaryColor: 'indigo'
}

export const layoutActions = {
  setReposPerPage: createStandardAction('layout/SET_REPOS_PER_PAGE')<ReposPerPage>(),
  setPrimaryColor: createStandardAction('layout/SET_PRIMARY_COLOR')<PrimaryColor>()
}

type RootAction = ActionType<typeof layoutActions>

export default createReducer<LayoutState, RootAction>(defaultState, {
  'layout/SET_REPOS_PER_PAGE': (state, { payload }) => ({
    ...state,
    reposPerPage: payload
  }),

  'layout/SET_PRIMARY_COLOR': (state, { payload }) => ({
    ...state,
    primaryColor: payload
  })
})
