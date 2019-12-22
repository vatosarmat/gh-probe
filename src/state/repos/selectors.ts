import { createSelector } from 'reselect'
import { chain, orderBy, map } from 'lodash'

import { Repo } from 'services/api'

import { ReposState } from './reducer'
import { ILayoutState, layoutSelectors } from '../layout'

const { getReposPerPage } = layoutSelectors

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

//
export interface ReposListProps {
  sortByStars: boolean
  language: string
  page: number
}

export const NO_LANGUAGE = 'NO_LANGUAGE'
export const ANY_LANGUAGE = 'ANY_LANGUAGE'

const getReposRecord = (state: IReposState) => state.repos.items
const isSortByStars = (state: IReposState, props: ReposListProps) => props.sortByStars
const getLanguage = (state: IReposState, props: ReposListProps) => props.language
const getPage = (state: IReposState, props: ReposListProps) => props.page

const getReposLanguages = createSelector<IReposState, Record<number, Repo>, string[]>(getReposRecord, reposRecord =>
  chain(reposRecord)
    .countBy(repo => repo.language ?? NO_LANGUAGE)
    .assign({ [ANY_LANGUAGE]: Infinity })
    .entries() //[language, count]
    .orderBy(1, 'desc') //order by count, ANY_LANGUAGE will be the first
    .map(0) //take language
    .value()
)

const getReposSorted = createSelector<IReposState, ReposListProps, Record<number, Repo>, boolean, Repo[]>(
  [getReposRecord, isSortByStars],
  (reposRecord, sortByStars) =>
    sortByStars
      ? orderBy(Object.values(reposRecord), 'stargazers_count', 'desc')
      : orderBy(Object.values(reposRecord), 'name', 'asc')
)

const getReposByLanguage = createSelector<IReposState, ReposListProps, Repo[], string, Repo[]>(
  [getReposSorted, getLanguage],
  (repos, language) =>
    language === ANY_LANGUAGE
      ? repos
      : repos.filter(repo => repo.language === language || (language === NO_LANGUAGE && !repo.language))
)

const getReposPage = createSelector<
  IReposState,
  IReposState,
  ILayoutState,
  ReposListProps,
  ReposListProps,
  {},
  Repo[],
  number,
  number,
  Repo[]
>([getReposByLanguage, getPage, getReposPerPage], (repos, page, reposPerPage) =>
  repos.slice(page * reposPerPage, Math.min((page + 1) * reposPerPage, repos.length))
)

const getReposIds = createSelector(getReposPage, repos => map(repos, 'id'))

function getRepoById(state: IReposState, { id }: { id: number }): Repo | undefined {
  return getReposRecord(state)[id]
}

export const reposSelectors = {
  getReposFetchStatus,
  getReposUsername,
  getReposError,
  getReposFetchProgress,
  getReposIds,
  getReposLanguages,
  getRepoById
}
