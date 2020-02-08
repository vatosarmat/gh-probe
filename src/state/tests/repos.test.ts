import { CANCEL } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { cloneDeep, keyBy } from 'lodash'

import { ReposPager, ReposPage, Repo } from 'services/api'
import { reposActions, State } from 'state'
import { Mutable } from 'utils/common'
import makeFx from './fixtures'
import { expectSagaState, api } from './helpers'

jest.mock('services/api')

describe('Fetch repos by username', () => {
  let fx: ReturnType<typeof makeFx>
  beforeEach(() => {
    fx = makeFx()
    jest.resetAllMocks()
  })

  const callFetchLcd = (repo: Repo) => call(api.fetchLastCommitDate, repo)
  const fetchLastCommitDateImpl = (repo: Repo) => Promise.resolve(fx.lastCommitDateByRepoId[repo.id])

  it('Success single page', () => {
    const username = fx.usersArray[0].name!
    const pager = new ReposPager('this is mock')

    const pagerNextResult: IteratorResult<ReposPage, ReposPage> = {
      done: true,
      value: fx.singleReposPage
    }
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResult)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)
    ;(api.fetchLastCommitDate as jest.Mock).mockImplementation(fetchLastCommitDateImpl)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(fx.singleReposPageExtended.repos, 'id')
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = { current: 1, total: 1 }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          ...pagerNextResult.value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.singleReposPageExtended))
        ]
      ]
    })
  })

  it('Success multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const pagerNextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      },
      {
        done: true,
        value: fx.reposPagesArray[1]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResults[0]).mockResolvedValueOnce(pagerNextResults[1])
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)
    ;(api.fetchLastCommitDate as jest.Mock).mockImplementation(fetchLastCommitDateImpl)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = {
      ...keyBy(fx.reposPagesArrayExtended[0].repos, 'id'),
      ...keyBy(fx.reposPagesArrayExtended[1].repos, 'id')
    }
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = { current: 2, total: 2 }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          ...pagerNextResults[0].value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.reposPagesArrayExtended[0]))
        ],
        [
          call(api.fetchRepos, username),
          call(pager.next),
          call(pager.next),
          ...pagerNextResults[1].value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.reposPagesArrayExtended[1]))
        ]
      ]
    })
  })

  it('Network error in multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const pagerNextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResults[0]).mockRejectedValueOnce(fx.networkError)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)
    ;(api.fetchLastCommitDate as jest.Mock).mockImplementation(fetchLastCommitDateImpl)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(fx.reposPagesArrayExtended[0].repos, 'id')
    expectedState.repos.status = 'ERROR'
    expectedState.repos.error = fx.networkError.toString()
    expectedState.repos.progress = { current: 1, total: 2 }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          ...pagerNextResults[0].value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.reposPagesArrayExtended[0]))
        ],
        [call(api.fetchRepos, username), call(pager.next), call(pager.next), put(reposActions.error(fx.networkError))]
      ]
    })
  })

  it('Abort by user in multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const pagerNextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResults[0]).mockImplementationOnce(() => {
      let timeout: NodeJS.Timeout
      const prom = new Promise(resolve => {
        timeout = setTimeout(resolve, 2000)
      })
      ;(prom as any)[CANCEL] = () => clearTimeout(timeout)

      return prom
    })
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)
    ;(api.fetchLastCommitDate as jest.Mock).mockImplementation(fetchLastCommitDateImpl)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(fx.reposPagesArrayExtended[0].repos, 'id')
    expectedState.repos.status = 'ABORTED'
    expectedState.repos.progress = { current: 1, total: 2 }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username), 100, reposActions.abort()],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          ...pagerNextResults[0].value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.reposPagesArrayExtended[0]))
        ],
        [call(api.fetchRepos, username), call(pager.next), call(pager.next)]
      ],
      unexpectedEffects: [
        [put(reposActions.error(fx.networkError))],
        [put(reposActions.pageReady(fx.reposPagesArrayExtended[1]))]
      ]
    })
  })

  it('New request overrides results of the previous', () => {
    const prevUsername = fx.usersArray[1].name!
    const newUsername = fx.usersArray[0].name!
    const pager = new ReposPager('this is mock')

    const pagerNextResult: IteratorResult<ReposPage, ReposPage> = {
      done: true,
      value: fx.singleReposPage
    }
    ;(pager.next as jest.Mock).mockResolvedValueOnce(pagerNextResult)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)
    ;(api.fetchLastCommitDate as jest.Mock).mockImplementation(fetchLastCommitDateImpl)

    const initialState = fx.defaultState as Mutable<State>
    initialState.repos.username = prevUsername
    initialState.repos.items = {
      ...keyBy(fx.reposPagesArrayExtended[0].repos, 'id'),
      ...keyBy(fx.reposPagesArrayExtended[1].repos, 'id')
    }

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = newUsername
    expectedState.repos.items = keyBy(fx.singleReposPageExtended.repos, 'id')
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = { current: 1, total: 1 }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(newUsername)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, newUsername),
          call(pager.next),
          ...pagerNextResult.value.repos.map(callFetchLcd),
          put(reposActions.pageReady(fx.singleReposPageExtended))
        ]
      ]
    })
  })
})
