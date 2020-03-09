import { createSelector } from 'reselect'
import { some, chain, orderBy, map } from 'lodash'

import { Repo } from 'services/api'

import { ReposState } from './reducer'
import { ILayoutState, layoutSelectors } from '../layout'

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
  language: string
  page: number
}

export interface LanguageInfo {
  language: string
  repoCount: number
}

export interface ReposIdsPage {
  from: number
  to: number
  hasPrevPage: boolean
  hasNextPage: boolean
  ids: number[]
}

export const NO_LANGUAGE = 'NO_LANGUAGE'
export const ANY_LANGUAGE = 'ANY_LANGUAGE'

const getReposUsername = (state: IReposState) => state.repos.userData?.login
const getReposError = (state: IReposState) => state.repos.error
const getReposFetchProgress = (state: IReposState) => state.repos.progress
const getReposFetchStatus = (state: IReposState) => state.repos.status
const getReposRecord = (state: IReposState) => state.repos.items

const getLanguage = (state: IReposState, props: RepoProps) => props.language
const getPage = (state: IReposState, props: RepoProps) => props.page
const getRepoSortingKey = (state: IReposState, props: RepoProps) => props.sortingKey
const getRepoSortingOrder = (state: IReposState, props: RepoProps) => props.sortingOrder

const getLanguageInfos = createSelector<IReposState, Record<number, Repo>, LanguageInfo[]>(
  getReposRecord,
  reposRecord => {
    const length = Object.keys(reposRecord).length
    return chain(reposRecord)
      .countBy(repo => repo.language ?? NO_LANGUAGE)
      .assign({ [ANY_LANGUAGE]: length })
      .reduce<LanguageInfo[]>((langItems, repoCount, language) => {
        langItems.push({ language, repoCount })
        return langItems
      }, [])
      .orderBy('repoCount', 'desc') //order by count, ANY_LANGUAGE should be the first
      .value()
  }
)

const getReposSorted = createSelector<
  IReposState,
  RepoProps,
  Record<number, Repo>,
  RepoSortingKey,
  RepoSortingOrder,
  Repo[]
>([getReposRecord, getRepoSortingKey, getRepoSortingOrder], (reposRecord, key, order) =>
  key === 'name'
    ? orderBy(Object.values(reposRecord), repo => repo.name.toLocaleLowerCase(), order)
    : orderBy(Object.values(reposRecord), key, order)
)

const haveReposStars = createSelector<IReposState, Record<number, Repo>, boolean>(getReposRecord, reposRecord =>
  some(reposRecord, 'starsCount')
)

const getReposByLanguage = createSelector<IReposState, RepoProps, Repo[], string, Repo[]>(
  [getReposSorted, getLanguage],
  (repos, language) =>
    language === ANY_LANGUAGE
      ? repos
      : repos.filter(repo => repo.language === language || (language === NO_LANGUAGE && !repo.language))
)

const getReposIdsPage = createSelector<
  IReposState,
  IReposState,
  ILayoutState,
  RepoProps,
  RepoProps,
  {},
  Repo[],
  number,
  number,
  ReposIdsPage
>([getReposByLanguage, getPage, getReposPerPage], (repos, page, reposPerPage) => {
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

function getRepoById(state: IReposState, { id }: { id: number }): Repo | undefined {
  return getReposRecord(state)[id]
}

export const reposSelectors = {
  getReposFetchStatus,
  getReposUsername,
  getReposError,
  getReposFetchProgress,
  getReposIdsPage,
  getLanguageInfos,
  getRepoById,
  haveReposStars
}
