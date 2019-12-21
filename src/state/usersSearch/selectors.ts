import { chain } from 'lodash'
import { createSelector } from 'reselect'

import { UsersSearchState } from './reducer'
import { SearchResultItem, UserBrief } from 'services/api'

export interface IUsersSearchState {
  readonly usersSearch: UsersSearchState
}

function getSearchQuery(state: IUsersSearchState) {
  return state.usersSearch.query
}

function getSearchResult(state: IUsersSearchState) {
  return state.usersSearch.result
}

const getSearchResultIds = createSelector(getSearchResult, result =>
  chain(Object.values(result))
    .orderBy('score', 'desc')
    .map('id')
    .value()
)

function getSearchResultById(
  state: IUsersSearchState,
  { id }: { id: number }
): SearchResultItem<UserBrief> | undefined {
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
