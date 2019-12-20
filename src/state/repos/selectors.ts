import { ReposState } from './reducer'

export interface IReposState {
  readonly repos: ReposState
}

// const getReposUsername = (state: IReposState) => {
//   return state.repos.username
// }

// const getPrimaryColor = (state: IReposState) => {
//   return state.layout.primaryColor-
// }

export const reposSelectors = {
  // getReposPerPage,
  // getPrimaryColor
}
/*

const { start: fetchReposStart, abort: fetchReposAbort } = fetchReposActions

export { fetchReposStart, fetchReposAbort }

export function getReposUsername(state: State) {
  return state.repos.username
}

export function getReposItems(state: State) {
  return state.repos.items
}

export function getReposProgress(state: State) {
  return state.repos.progress
}

export function getReposStatus(state: State) {
  return state.repos.status
}

export function getReposError(state: State) {
  return state.repos.error
}
*/
