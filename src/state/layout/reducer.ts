import { ActionType, createReducer, createStandardAction } from 'typesafe-actions'
//import {defaultPrimaryColor, defaultReposPerPage, PrimaryColor, ReposPerPage} from "../misc/entities"

interface State {
  reposPerPage: 5 | 10 | 15 | 20
  primaryColor: 'indigo' | 'purple' | 'teal'
}

const defaultState: State = {
  reposPerPage: 10,
  primaryColor: 'indigo'
}

export const layoutActions = {
  setReposPerPage: createStandardAction('layout/SET_REPOS_PER_PAGE')<State['reposPerPage']>(),
  setPrimaryColor: createStandardAction('layout/SET_PRIMARY_COLOR')<State['primaryColor']>()
}

type RootAction = ActionType<typeof layoutActions>

export default createReducer<State, RootAction>(defaultState, {
  'layout/SET_REPOS_PER_PAGE': (state, { payload }) => ({
    ...state,
    reposPerPage: payload
  }),

  'layout/SET_PRIMARY_COLOR': (state, { payload }) => ({
    ...state,
    primaryColor: payload
  })
})
