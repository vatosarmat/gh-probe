import { createSelector } from 'reselect'
import { chain } from 'lodash'

import { ReposState } from './reducer'
import { Repo } from 'services/api'

export interface IReposState {
  readonly repos: ReposState
}

function getReposFetchStatus(state: IReposState) {
  return state.repos.status
}

function getReposUsername(state: IReposState) {
  return state.repos.username
}

function getReposError(state: IReposState) {
  return state.repos.error
}

function getReposFetchProgress(state: IReposState) {
  return state.repos.progress
}

function getReposItems(state: IReposState) {
  return state.repos.items
}

const getReposIds = createSelector(getReposItems, items =>
  chain(Object.values(items))
    .sortBy('name')
    .map('id')
    .value()
)

function getRepoById(state: IReposState, { id }: { id: number }): Repo | undefined {
  return getReposItems(state)[id]
}

export const reposSelectors = {
  getReposFetchStatus,
  getReposUsername,
  getReposError,
  getReposFetchProgress,
  getReposIds,
  getRepoById
}
