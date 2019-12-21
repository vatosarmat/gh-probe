import { orderBy } from 'lodash'
import { createSelector } from 'reselect'

import { UsersSearchState } from './reducer'

export interface IUsersSearchState {
  readonly usersSearch: UsersSearchState
}

function getSearchQuery(state: IUsersSearchState) {
  return state.usersSearch.query
}

function getSearchResult(state: IUsersSearchState) {
  return state.usersSearch.result
}

const getSearchResultIds = createSelector(getSearchResult, result => orderBy(Object.values(result), 'score', 'desc'))

function getSearchResultById(state: IUsersSearchState, { id }: { id: number }) {
  return getSearchResult(state)[id]
}

function isSearchInProgress(state: IUsersSearchState) {
  return state.usersSearch.inProgress
}

function getSearchError(state: IUsersSearchState) {
  return state.usersSearch.error
}

export const usersSearchSelectors = {
  getSearchQuery,
  getSearchResultIds,
  getSearchResultById,
  isSearchInProgress,
  getSearchError
}
