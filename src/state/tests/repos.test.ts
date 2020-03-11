import { CANCEL } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { cloneDeep, keyBy } from 'lodash'

import { fetchUserAndRepos, fetchReposAfterCursor } from 'services/api'
import { reposActions, State } from 'state'
import { Mutable } from 'utils/common'
import makeFx from 'services/api/fixtures'
import { expectSagaState } from './helpers'

jest.mock('services/api')

describe('Fetch repos by login', () => {
  let fx: ReturnType<typeof makeFx>
  beforeEach(() => {
    fx = makeFx()
    jest.resetAllMocks()
  })

  it('Success single page', () => {
    const fxRequestedUserLogin = fx.users[0].login!
    const fxUser = fx.users[0]
    const fxReposPage = fx.singleReposPage
    ;(fetchUserAndRepos as jest.Mock).mockResolvedValueOnce([fxUser, fxReposPage])

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.requestedUserLogin = fxRequestedUserLogin
    expectedState.repos.userData = fxUser
    expectedState.repos.items = keyBy(fxReposPage.repos, 'id')
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = { currentPage: 1, totalPages: 1, lastRepoCursor: fxReposPage.lastRepoCursor }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(fxRequestedUserLogin)],
      expectedState,
      expectedEffects: [
        [
          call(fetchUserAndRepos, fxRequestedUserLogin),
          put(reposActions.userDataReady(fxUser)),
          put(reposActions.pageReady(fxReposPage))
        ]
      ]
    })
  })

  it('Success multi page', () => {
    const fxRequestedUserLogin = fx.users[1].login!
    const fxUser = fx.users[1]
    ;(fetchUserAndRepos as jest.Mock).mockResolvedValueOnce([fxUser, fx.multipleRepoPages[0]])
    ;(fetchReposAfterCursor as jest.Mock).mockResolvedValueOnce(fx.multipleRepoPages[1])

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.requestedUserLogin = fxRequestedUserLogin
    expectedState.repos.userData = fxUser
    expectedState.repos.items = {
      ...keyBy(fx.multipleRepoPages[0].repos, 'id'),
      ...keyBy(fx.multipleRepoPages[1].repos, 'id')
    }
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = {
      currentPage: 2,
      totalPages: 2,
      lastRepoCursor: fx.multipleRepoPages[1].lastRepoCursor
    }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(fxRequestedUserLogin)],
      expectedState,
      expectedEffects: [
        [
          call(fetchUserAndRepos, fxRequestedUserLogin),
          put(reposActions.userDataReady(fxUser)),
          put(reposActions.pageReady(fx.multipleRepoPages[0])),
          call(fetchReposAfterCursor, fxRequestedUserLogin, fx.multipleRepoPages[0].lastRepoCursor),
          put(reposActions.pageReady(fx.multipleRepoPages[1]))
        ]
      ]
    })
  })

  it('Network error in multi page', () => {
    const fxRequestedUserLogin = fx.users[1].login!
    const fxUser = fx.users[1]
    ;(fetchUserAndRepos as jest.Mock).mockReturnValueOnce([fxUser, fx.multipleRepoPages[0]])
    ;(fetchReposAfterCursor as jest.Mock).mockRejectedValueOnce(fx.networkError)

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.requestedUserLogin = fxRequestedUserLogin
    expectedState.repos.userData = fxUser
    expectedState.repos.items = keyBy(fx.multipleRepoPages[0].repos, 'id')
    expectedState.repos.status = 'ERROR'
    expectedState.repos.error = fx.networkError.toString()
    expectedState.repos.progress = {
      currentPage: 1,
      totalPages: 2,
      lastRepoCursor: fx.multipleRepoPages[0].lastRepoCursor
    }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(fxRequestedUserLogin)],
      expectedState,
      expectedEffects: [
        [
          call(fetchUserAndRepos, fxRequestedUserLogin),
          put(reposActions.userDataReady(fxUser)),
          put(reposActions.pageReady(fx.multipleRepoPages[0])),
          call(fetchReposAfterCursor, fxRequestedUserLogin, fx.multipleRepoPages[0].lastRepoCursor),
          put(reposActions.error(fx.networkError))
        ]
      ]
    })
  })

  it('Stop by user in multi page', () => {
    const fxRequestedUserLogin = fx.users[1].login!
    const fxUser = fx.users[1]
    ;(fetchUserAndRepos as jest.Mock).mockReturnValueOnce([fxUser, fx.multipleRepoPages[0]])
    ;(fetchReposAfterCursor as jest.Mock).mockImplementationOnce(() => {
      let timeout: NodeJS.Timeout
      const prom = new Promise(resolve => {
        timeout = setTimeout(resolve, 2000)
      })
      ;(prom as any)[CANCEL] = () => clearTimeout(timeout)

      return prom
    })

    const initialState = fx.defaultState as Mutable<State>

    const expectedState = cloneDeep(initialState)
    expectedState.repos.requestedUserLogin = fxRequestedUserLogin
    expectedState.repos.userData = fxUser
    expectedState.repos.items = keyBy(fx.multipleRepoPages[0].repos, 'id')
    expectedState.repos.status = 'STOPPED'
    expectedState.repos.progress = {
      currentPage: 1,
      totalPages: 2,
      lastRepoCursor: fx.multipleRepoPages[0].lastRepoCursor
    }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(fxRequestedUserLogin), 100, reposActions.stop()],
      expectedState,
      expectedEffects: [
        [
          call(fetchUserAndRepos, fxRequestedUserLogin),
          put(reposActions.userDataReady(fxUser)),
          put(reposActions.pageReady(fx.multipleRepoPages[0])),
          call(fetchReposAfterCursor, fxRequestedUserLogin, fx.multipleRepoPages[0].lastRepoCursor)
        ]
      ],
      unexpectedEffects: [
        [put(reposActions.error(fx.networkError))],
        [put(reposActions.pageReady(fx.multipleRepoPages[1]))]
      ]
    })
  })

  it('New request overrides results of the previous', () => {
    const initialUserData = fx.users[1]
    const expectedUserData = fx.users[0]
    const expectedReposPage = fx.singleReposPage
    ;(fetchUserAndRepos as jest.Mock).mockResolvedValueOnce([expectedUserData, expectedReposPage])

    const initialState = fx.defaultState as Mutable<State>
    initialState.repos.requestedUserLogin = initialUserData.login
    initialState.repos.userData = initialUserData
    initialState.repos.items = {
      ...keyBy(fx.multipleRepoPages[0].repos, 'id'),
      ...keyBy(fx.multipleRepoPages[1].repos, 'id')
    }
    initialState.repos.progress = {
      currentPage: 2,
      totalPages: 2,
      lastRepoCursor: fx.multipleRepoPages[1].lastRepoCursor
    }

    const expectedState = cloneDeep(initialState)
    expectedState.repos.requestedUserLogin = expectedUserData.login
    expectedState.repos.userData = expectedUserData
    expectedState.repos.items = keyBy(fx.singleReposPage.repos, 'id')
    expectedState.repos.status = 'COMPLETE'
    expectedState.repos.progress = { currentPage: 1, totalPages: 1, lastRepoCursor: expectedReposPage.lastRepoCursor }

    return expectSagaState({
      initialState,
      dispatchActions: [reposActions.start(expectedUserData.login)],
      expectedState,
      expectedEffects: [
        [
          call(fetchUserAndRepos, expectedUserData.login),
          put(reposActions.userDataReady(expectedUserData)),
          put(reposActions.pageReady(expectedReposPage))
        ]
      ]
    })
  })
})
