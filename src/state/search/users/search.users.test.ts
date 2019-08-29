import { createStore, applyMiddleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { waitForStateChange } from 'utils'
import reducer, { searchUsersActions, SearchUsersState } from './reducer'
import saga from './saga'
import Api from 'concepts/api'

describe('Search-users duck', () => {
  let api: Api
  let testEnv: Record<string, string>
  let store: Store<SearchUsersState>
  let promisedState: Promise<SearchUsersState>

  const { request } = searchUsersActions

  beforeAll(() => {
    testEnv = Api.getTesEnv()
    api = new Api(testEnv.githubProxyBaseUrl)

    const sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(saga, api)
  })

  it('Initial state', () => {
    expect(store.getState()).toEqual({
      query: '',
      result: null,
      inProgress: false,
      error: null
    })
  })

  it('REQUEST sets correct state', () => {
    store.dispatch(request(testEnv.user))
    promisedState = waitForStateChange(store)
    expect(store.getState().inProgress).toBeTruthy()
  })

  it('SUCCESS sets correct state', () => {
    return expect(promisedState).resolves.toEqual(
      expect.objectContaining({
        result: expect.arrayContaining([
          expect.objectContaining({
            login: testEnv.user,
            type: 'User',
            avatar_url: expect.any(String)
          })
        ]),
        query: testEnv.user,
        inProgress: false,
        error: null
      })
    )
  })

  describe('with mocked fetch', () => {
    const realFetch = window.fetch

    afterAll(() => {
      window.fetch = realFetch
    })

    it('FAILURE sets correct state', () => {
      window.fetch = jest.fn().mockRejectedValueOnce(new Error('NONONO'))

      store.dispatch(request(testEnv.user))
      promisedState = waitForStateChange(store)

      return expect(promisedState).resolves.toEqual(
        expect.objectContaining({
          inProgress: false,
          error: expect.any(Error)
        })
      )
    })
  })
})
