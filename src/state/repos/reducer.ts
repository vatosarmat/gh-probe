// import {ActionType, createReducer, createStandardAction} from "typesafe-actions"
// import {RequestResultArray} from "../utils"
// import {Owner} from "../owners/types"
// import {FetchProgress, Repo} from "./types"

// type FetchResult = RequestResultArray<Repo>

// export interface State {
//   readonly items: Repo[]
//   readonly status: 'IDLE' | 'IN_PROGRESS' | 'INTERRUPTED' | 'ERROR' | 'FULL'
//   readonly progress: {} | null
//   readonly error: Error | null
// }

// export interface ReposState extends FetchResult {
//   owner: Owner
//   fetchAbortIssued?: true
//   fetchProgress?: FetchProgress
// }

// export const defaultReposState:ReposState = {
//   owner: {
//     type: 'User',
//     login: ''
//   }
// }

// export const fetchReposActions = {
//   start: createStandardAction('repos/FETCH_START')<string>(),
//   pageReady: createStandardAction('repos/FETCH_PAGE_READY')<FetchProgress>(),
//   abort: createStandardAction('repos/FETCH_ABORT')<{}>(),
//   complete: createStandardAction('repos/FETCH_COMPLETE')<FetchResult>()
// }

// type ReposAction = ActionType<typeof reposAction>

// export const reposReducer = createReducer<ReposState, ReposAction>(defaultReposState, {
//   'repos/FETCH_START': (state, {payload}) => ({
//     ...state,
//     owner: payload,
//     status: 'IN_PROGRESS'
//   }),

//   'repos/FETCH_PAGE_READY': (state, {payload}) => ({
//     ...state,
//     fetchProgress: payload
//   }),

//   'repos/FETCH_ABORT': (state) => ({
//     ...state,
//     fetchAbortIssued: true
//   }),

//   'repos/FETCH_COMPLETE': (state, {payload}) => ({
//     ...state,
//     ...payload,
//     fetchProgress: undefined,
//     fetchAbortIssued: undefined
//   })
// })
