import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { Repo, ReposPage } from 'services/api'
import { keyBy } from 'lodash'

import { DeepReadonly } from 'utils/common'

export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'ABORTED' | 'ERROR' | 'COMPLETE'

export interface ReposFetchProgress {
  current: number
  total: number
}

export interface RepoExtended extends Repo {
  last_commit_date: string
}

export type ExtendedReposPage = ReposPage<RepoExtended>

export type ReposState = DeepReadonly<{
  username?: string
  items: Record<number, RepoExtended>
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
  pageReady: createAction('repos/FETCH_PAGE_READY')<ExtendedReposPage>(),
  abort: createAction('repos/FETCH_ABORT')(),
  error: createAction('repos/FETCH_ERROR', (error: Error) => error.toString())()
}

export type ReposAction = ActionType<typeof reposActions>

export default createReducer<ReposState, ReposAction>(defaultReposState, {
  'repos/FETCH_START': (state, { payload: username }) => ({ ...defaultReposState, username, status: 'IN_PROGRESS' }),

  'repos/FETCH_PAGE_READY': (state, { payload: { repos, current, total } }) => {
    return state.status === 'IN_PROGRESS'
      ? {
          ...state,
          items: {
            ...state.items,
            ...keyBy(repos, 'id')
          },
          progress: { current, total },
          status: current === total ? 'COMPLETE' : 'IN_PROGRESS'
        }
      : state
  },

  'repos/FETCH_ABORT': state => {
    return { ...state, status: 'ABORTED' }
  },

  'repos/FETCH_ERROR': (state, { payload: error }) => ({ ...state, status: 'ERROR', error })
})
