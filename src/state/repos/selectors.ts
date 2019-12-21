import { ReposState } from './reducer'

export interface IReposState {
  readonly repos: ReposState
}

export function getReposFetchStatus(state: IReposState) {
  return state.repos.status
}

export const reposSelectors = {
  getReposFetchStatus
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



export function getReposError(state: State) {
  return state.repos.error
}
*/
