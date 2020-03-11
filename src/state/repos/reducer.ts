import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { User, Repo, ReposPage } from 'services/api'
import { keyBy } from 'lodash'

import { DeepReadonly } from 'utils/common'

export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'STOPPED' | 'ERROR' | 'COMPLETE'

export interface ReposFetchProgress {
  currentPage: number
  totalPages: number
  lastRepoCursor: string
}

export type ReposState = DeepReadonly<{
  requestedUserLogin?: string
  userData?: User
  items: Record<string, Repo>
  status: ReposFetchStatus
  progress?: ReposFetchProgress
  error?: string
}>

export const defaultReposState: ReposState = {
  items: {},
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
          items: {
            ...state.items,
            ...keyBy(repos, 'id')
          },
          progress: state.progress
            ? {
                ...state.progress,
                lastRepoCursor,
                currentPage: state.progress.currentPage + 1
              }
            : {
                lastRepoCursor,
                totalPages: Math.ceil(totalReposCount / repos.length),
                currentPage: 1
              },
          status: hasNextPage ? 'IN_PROGRESS' : 'COMPLETE'
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
