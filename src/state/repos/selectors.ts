import { createSelector, Selector } from 'reselect'
import { some, flow, orderBy, map, countBy, assign, reduce } from 'lodash-es'

import { Repo } from 'services/api'

import { ReposState } from './reducer'
import { layoutSelectors } from '../layout'

const { getReposPerPage } = layoutSelectors

export interface IReposState {
  readonly repos: ReposState
}

export const repoSortingKeyTuple = ['name', 'starsCount', 'createdAt', 'pushedAt'] as const
export type RepoSortingKey = typeof repoSortingKeyTuple[number]
export const repoSortingKeyName: Record<RepoSortingKey, string> = {
  name: 'name',
  starsCount: 'stars count',
  createdAt: 'creation date',
  pushedAt: 'push date'
}

export const repoSortingOrderTuple = ['desc', 'asc'] as const
export type RepoSortingOrder = typeof repoSortingOrderTuple[number]

export interface RepoProps {
  sortingKey: RepoSortingKey
  sortingOrder: RepoSortingOrder
  languageName: string
  page: number
}

export interface LanguageInfo {
  name: string
  repoCount: number
}

export interface ReposIdsPage {
  from: number
  to: number
  hasPrevPage: boolean
  hasNextPage: boolean
  ids: string[]
}

export const NO_LANGUAGE = 'NO_LANGUAGE'
export const ANY_LANGUAGE = 'ANY_LANGUAGE'

const getReposUserData = (state: IReposState) => state.repos.userData
const getRequestedUserLogin = (state: IReposState) => state.repos.requestedUserLogin
const getReposError = (state: IReposState) => state.repos.error
const getReposFetchProgress = (state: IReposState) => state.repos.progress
const getReposFetchStatus = (state: IReposState) => state.repos.status
const getReposRecord = (state: IReposState) => state.repos.items

const getLanguageName = (_state: IReposState, props: RepoProps) => props.languageName
const getPage = (_state: IReposState, props: RepoProps) => props.page
const getRepoSortingKey = (_state: IReposState, props: RepoProps) => props.sortingKey
const getRepoSortingOrder = (_state: IReposState, props: RepoProps) => props.sortingOrder

const isUserDataFetching = (state: IReposState) => !state.repos.userData && state.repos.status === 'IN_PROGRESS'
const getUserDataFetchError = (state: IReposState) => (state.repos.userData ? undefined : state.repos.error)

const getLanguageInfos = createSelector(getReposRecord, reposRecord => {
  const length = Object.keys(reposRecord).length
  return flow(
    v => countBy(v, repo => repo.primaryLanguage?.name ?? NO_LANGUAGE),
    v => assign(v, { [ANY_LANGUAGE]: length }),
    v =>
      reduce<Record<string, number>, LanguageInfo[]>(
        v,
        (langItems, repoCount, name) => {
          langItems.push({ name, repoCount })
          return langItems
        },
        []
      ),
    v => orderBy(v, 'repoCount', 'desc') //order by count, ANY_LANGUAGE should be the first
  )(reposRecord)
})

const getReposSorted: Selector<IReposState, Repo[], [RepoProps]> = createSelector(
  [getReposRecord, getRepoSortingKey, getRepoSortingOrder],
  (reposRecord, key, order) =>
    key === 'name'
      ? orderBy(Object.values(reposRecord), repo => repo.name.toLocaleLowerCase(), order)
      : orderBy(Object.values(reposRecord), key, order)
)

const haveReposStars = createSelector(getReposRecord, reposRecord => some(reposRecord, 'starsCount'))

const getReposByLanguage: Selector<IReposState, Repo[], [RepoProps]> = createSelector(
  [getReposSorted, getLanguageName],
  (repos, languageName) =>
    languageName === ANY_LANGUAGE
      ? repos
      : repos.filter(
          repo => repo.primaryLanguage?.name === languageName || (languageName === NO_LANGUAGE && !repo.primaryLanguage)
        )
)
const getReposIdsPage = createSelector([getReposByLanguage, getPage, getReposPerPage], (repos, page, reposPerPage) => {
  const from = page * reposPerPage
  const to = Math.min((page + 1) * reposPerPage, repos.length)
  const hasPrevPage = page > 0
  const hasNextPage = to < repos.length

  return {
    hasPrevPage,
    hasNextPage,
    from,
    to,
    ids: map(repos.slice(from, to), 'id')
  }
})

function getRepoById(state: IReposState, { id }: { id: string }): Repo | undefined {
  return getReposRecord(state)[id]
}

export const reposSelectors = {
  isUserDataFetching,
  getUserDataFetchError,
  getReposUserData,
  getRequestedUserLogin,
  getReposFetchStatus,
  getReposError,
  getReposFetchProgress,
  getReposIdsPage,
  getLanguageInfos,
  getRepoById,
  haveReposStars
}
