import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { Repo, ReposPage } from 'services/api'
import { keyBy } from 'lodash'

import { DeepReadonly } from 'utils/common'

export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'STOPPED' | 'ERROR' | 'COMPLETE'

export interface ReposFetchProgress {
  current: number
  total: number
  nextUrl?: string
}

export type ReposState = DeepReadonly<{
  username?: string
  items: Record<number, Repo>
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
  pageReady: createAction('repos/FETCH_PAGE_READY')<ReposPage>(),
  stop: createAction('repos/FETCH_STOP')(),
  resume: createAction('repos/FETCH_RESUME')(),
  error: createAction('repos/FETCH_ERROR', (error: Error) => error.toString())()
}

export type ReposAction = ActionType<typeof reposActions>

export default createReducer<ReposState, ReposAction>(defaultReposState, {
  'repos/FETCH_START': (state, { payload: username }) => ({ ...defaultReposState, username, status: 'IN_PROGRESS' }),

  'repos/FETCH_PAGE_READY': (state, { payload: { repos, current, total, nextUrl } }) =>
    state.status === 'IN_PROGRESS'
      ? {
          ...state,
          items: {
            ...state.items,
            ...keyBy(repos, 'id')
          },
          progress: nextUrl ? { current, total, nextUrl } : { current, total },
          status: current === total ? 'COMPLETE' : 'IN_PROGRESS'
        }
      : state,

  'repos/FETCH_STOP': state => ({ ...state, status: 'STOPPED' }),

  'repos/FETCH_RESUME': state => ({ ...state, status: 'IN_PROGRESS' }),

  'repos/FETCH_ERROR': (state, { payload: error }) => ({ ...state, status: 'ERROR', error })
})
