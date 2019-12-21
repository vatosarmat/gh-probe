import { CANCEL } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { cloneDeep, keyBy } from 'lodash'

import { ReposPager, ReposPage } from 'services/api'
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

  it('Success single page', () => {
    const username = fx.usersArray[0].name!
    const expectedReposPage = fx.singleReposPage
    const pager = new ReposPager('this is mock')

    const nextResult: IteratorResult<ReposPage, ReposPage> = {
      done: true,
      value: expectedReposPage
    }
    ;(pager.next as jest.Mock).mockResolvedValueOnce(nextResult)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(expectedReposPage.repos, 'id')
    expectedState.repos.status = 'COMPLETE'

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [call(api.fetchRepos, username), call(pager.next), put(reposActions.complete(expectedReposPage.repos))]
      ]
    })
  })

  it('Success multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const nextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      },
      {
        done: true,
        value: fx.reposPagesArray[1]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(nextResults[0]).mockResolvedValueOnce(nextResults[1])
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = {
      ...keyBy(fx.reposPagesArray[0].repos, 'id'),
      ...keyBy(fx.reposPagesArray[1].repos, 'id')
    }
    expectedState.repos.status = 'COMPLETE'

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          put(
            reposActions.pageReady({
              current: 1,
              total: 2
            })
          ),
          call(pager.next),
          put(reposActions.complete([...fx.reposPagesArray[0].repos, ...fx.reposPagesArray[1].repos]))
        ]
      ]
    })
  })

  it('Network error in multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const nextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(nextResults[0]).mockRejectedValueOnce(fx.networkError)
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(fx.reposPagesArray[0].repos, 'id')
    expectedState.repos.status = 'ERROR'
    expectedState.repos.error = fx.networkError.toString()

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username)],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          put(
            reposActions.pageReady({
              current: 1,
              total: 2
            })
          ),
          call(pager.next),
          put(reposActions.error(fx.networkError, [...fx.reposPagesArray[0].repos]))
        ]
      ]
    })
  })

  it('Abort by user in multi page', () => {
    const username = fx.usersArray[1].name!
    const pager = new ReposPager('this is mock')

    const nextResults: IteratorResult<ReposPage, ReposPage>[] = [
      {
        done: false,
        value: fx.reposPagesArray[0]
      }
    ]
    ;(pager.next as jest.Mock).mockResolvedValueOnce(nextResults[0]).mockImplementationOnce(() => {
      let timeout: NodeJS.Timeout
      const prom = new Promise(resolve => {
        timeout = setTimeout(resolve, 2000)
      })
      ;(prom as any)[CANCEL] = () => clearTimeout(timeout)

      return prom
    })
    ;(api.fetchRepos as jest.Mock).mockReturnValueOnce(pager)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.username = username
    expectedState.repos.items = keyBy(fx.reposPagesArray[0].repos, 'id')
    expectedState.repos.status = 'ABORTED'

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(username), 100, reposActions.abort()],
      expectedState,
      expectedEffects: [
        [
          call(api.fetchRepos, username),
          call(pager.next),
          put(
            reposActions.pageReady({
              current: 1,
              total: 2
            })
          ),
          call(pager.next),
          put(reposActions.aborted([...fx.reposPagesArray[0].repos]))
        ]
      ]
    })
  })
})
