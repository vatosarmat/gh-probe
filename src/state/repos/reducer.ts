import { ActionType, createReducer, createStandardAction } from 'typesafe-actions'
import { Repo } from 'api'

interface Progress {
  readonly current: number
  readonly total: number
}

interface Completion {
  readonly status: 'ABORTED' | 'ERROR' | 'FULL'
  readonly items: Repo[]
  readonly error: Error | null
}

export interface State {
  readonly items: Repo[]
  readonly status: 'IDLE' | 'IN_PROGRESS' | Completion['status']
  readonly progress: Progress | null
  readonly error: Error | null
}

export const defaultState: State = {
  items: [],
  status: 'IDLE',
  progress: null,
  error: null
}

export const fetchReposActions = {
  start: createStandardAction('repos/FETCH_START')<string>(),
  pageReady: createStandardAction('repos/FETCH_PAGE_READY')<Progress>(),
  abort: createStandardAction('repos/FETCH_ABORT')(),
  complete: createStandardAction('repos/FETCH_COMPLETE')<Completion>()
}

type RootAction = ActionType<typeof fetchReposActions>

export default createReducer<State, RootAction>(defaultState, {
  'repos/FETCH_START': state => ({
    ...state,
    status: 'IN_PROGRESS'
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
