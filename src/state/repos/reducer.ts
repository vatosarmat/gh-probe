import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { User, Repo, ReposPage } from 'services/api'
import { keyBy } from 'lodash'

import { DeepReadonly } from 'utils/common'
import { appConfig } from 'config'
const { reposPageLength } = appConfig

export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'STOPPED' | 'ERROR' | 'COMPLETE'

export interface ReposFetchProgress {
  currentPage: number
  totalPages: number
  lastRepoCursor: string
}

export type ReposState = DeepReadonly<{
  requestedUserLogin?: string
  userData?: User
  repos: Record<string, Repo>
  status: ReposFetchStatus
  progress?: ReposFetchProgress
  error?: string
}>

export const defaultReposState: ReposState = {
  repos: {},
  status: 'IDLE'
}

export const reposActions = {
  start: createAction('repos/FETCH_START')<string>(),
  userDataReady: createAction('repos/FETCH_USER_DATA_READY')<User>(),
  pageReady: createAction('repos/FETCH_PAGE_READY')<ReposPage>(),
  stop: createAction('repos/FETCH_STOP')(),
  resume: createAction('repos/FETCH_RESUME')(),
  error: createAction('repos/FETCH_ERROR', (error: Error) => error.toString())()
}

export type ReposAction = ActionType<typeof reposActions>

export default createReducer<ReposState, ReposAction>(defaultReposState, {
  'repos/FETCH_START': (state, { payload: requestedUserLogin }) => ({
    ...defaultReposState,
    requestedUserLogin,
    status: 'IN_PROGRESS'
  }),

  'repos/FETCH_USER_DATA_READY': (state, { payload: userData }) => ({ ...state, userData }),

  'repos/FETCH_PAGE_READY': (state, { payload: { repos, lastRepoCursor, totalReposCount, hasNextPage } }) =>
    state.status === 'IN_PROGRESS'
      ? {
          ...state,
          repos: {
            ...state.repos,
            ...keyBy(repos, 'id')
          },
          progress: {
            lastRepoCursor,
            totalPages: Math.ceil(totalReposCount / reposPageLength),
            currentPage: state.progress ? state.progress.currentPage + 1 : 1
          },
          status: hasNextPage ? 'COMPLETE' : 'IN_PROGRESS'
        }
      : state,

  'repos/FETCH_STOP': state =>
    state.status === 'IN_PROGRESS'
      ? state.progress
        ? { ...state, status: 'STOPPED' }
        : { ...defaultReposState }
      : state,

  'repos/FETCH_RESUME': state => ({ ...state, status: 'IN_PROGRESS' }),

  'repos/FETCH_ERROR': (state, { payload: error }) => ({ ...state, status: 'ERROR', error })
})
