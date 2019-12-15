import { ActionType, createReducer, createStandardAction } from 'typesafe-actions'
import { Repo } from 'services/api'
import { ReposFetchStatus, ReposFetchProgress } from 'services/repos'

interface Completion {
  readonly status: ReposFetchStatus
  readonly items: Repo[]
  readonly error: Error | null
}

export interface ReposState extends Completion {
  readonly progress: ReposFetchProgress | null
  readonly username: string
}

export const defaultState: ReposState = {
  username: '',
  items: [],
  status: 'IDLE',
  progress: null,
  error: null
}

export const fetchReposActions = {
  start: createStandardAction('repos/FETCH_START')<string>(),
  pageReady: createStandardAction('repos/FETCH_PAGE_READY')<ReposFetchProgress>(),
  abort: createStandardAction('repos/FETCH_ABORT')(),
  complete: createStandardAction('repos/FETCH_COMPLETE')<Completion>()
}

type RootAction = ActionType<typeof fetchReposActions> | { type: 'RESET' }

export default createReducer<ReposState, RootAction>(defaultState, {
  RESET: () => defaultState,

  'repos/FETCH_START': (state, { payload }) => ({
    ...state,
    status: 'IN_PROGRESS',
    username: payload
  }),

  'repos/FETCH_PAGE_READY': (state, { payload }) => ({
    ...state,
    progress: payload
  }),

  'repos/FETCH_ABORT': state => state,

  'repos/FETCH_COMPLETE': (state, { payload }) => ({
    ...state,
    ...payload,
    progress: null
  })
})
