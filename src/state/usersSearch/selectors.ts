import { createSelector } from 'reselect'

import { UsersSearchState } from './reducer'
import { SearchUserResultItem } from 'services/api'

export interface IUsersSearchState {
  readonly usersSearch: UsersSearchState
}

function getSearchQuery(state: IUsersSearchState) {
  return state.usersSearch.query
}

function getSearchResult(state: IUsersSearchState) {
  return state.usersSearch.result
}

const getSearchResultIds = createSelector(getSearchResult, result => Object.keys(result))

function getSearchResultById(state: IUsersSearchState, { id }: { id: string }): SearchUserResultItem | undefined {
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
