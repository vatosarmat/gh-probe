import { DeepReadonly } from 'utility-types'
import { ActionType, createReducer, createAction } from 'typesafe-actions'
import { Repo } from 'services/api'
import { omit, keyBy } from 'lodash'

export type ReposFetchStatus = 'IDLE' | 'IN_PROGRESS' | 'ABORTED' | 'ERROR' | 'COMPLETE'

export interface ReposFetchProgress {
  current: number
  total: number
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

export const fetchReposActions = {
  start: createAction('repos/FETCH_START')<string>(),
  pageReady: createAction('repos/FETCH_PAGE_READY')<ReposFetchProgress>(),
  abort: createAction('repos/FETCH_ABORT')(),

  aborted: createAction('repos/FETCH_ABORTED')<Repo[]>(),
  error: createAction('repos/FETCH_ERROR', (error: Error, items: Repo[]) => ({ error, items }))(),
  complete: createAction('repos/FETCH_COMPLETE')<Repo[]>()
}

type RootAction = ActionType<typeof fetchReposActions>

export default createReducer<ReposState, RootAction>(defaultReposState, {
  'repos/FETCH_START': (state, { payload }) =>
    omit(
      {
        ...state,
        status: 'IN_PROGRESS' as const,
        username: payload
      },
      ['progress', 'error']
    ),
  'repos/FETCH_PAGE_READY': (state, { payload }) => ({
    ...state,
    progress: payload
  }),
  'repos/FETCH_ABORT': state => state,

  'repos/FETCH_ABORTED': (state, { payload: items }) =>
    omit(
      {
        ...state,
        status: 'ABORTED' as const,
        items: {
          ...state.items,
          ...keyBy(items, 'id')
        }
      },
      ['progress', 'error']
    ),
  'repos/FETCH_ERROR': (state, { payload: { error, items } }) =>
    omit(
      {
        ...state,
        status: 'ERROR' as const,
        error: error.toString(),
        items: {
          ...state.items,
          ...keyBy(items, 'id')
        }
      },
      ['progress']
    ),
  'repos/FETCH_COMPLETE': (state, { payload: items }) =>
    omit(
      {
        ...state,
        status: 'COMPLETE' as const,
        items: {
          ...state.items,
          ...keyBy(items, 'id')
        }
      },
      ['progress', 'error']
    )
})
