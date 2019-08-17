import { createStore, applyMiddleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { waitForStateChange } from 'utils'
import reducer, { fetchUserActions, State } from './reducer'
import saga from './saga'
import Api from 'api'

describe('User duck', () => {
  let api: Api
  let testEnv: Record<string, string>
  let store: Store<State>
  let promisedState: Promise<State>

  const { request } = fetchUserActions

  beforeAll(() => {
    testEnv = Api.getTesEnv()
    api = new Api(testEnv.githubToken)

    const sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(saga, api)
  })

  it('Initial state', () => {
    expect(store.getState()).toEqual({
      data: null,
      isFetching: false,
      error: null
    })
  })

  it('REQUEST sets correct state', () => {
    store.dispatch(request(testEnv.user))
    promisedState = waitForStateChange(store)
    expect(store.getState().isFetching).toBeTruthy()
  })

  it('SUCCESS sets correct state', () => {
    return expect(promisedState).resolves.toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          login: testEnv.user,
          type: 'User',
          avatar_url: expect.any(String),
          bio: testEnv.userBio
        }),
        isFetching: false,
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
          isFetching: false,
          error: expect.any(Error)
        })
      )
    })
  })
})
