import { createStore, applyMiddleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { waitForState } from 'utils'
import reducer, { fetchReposActions, State } from './reducer'
import saga from './saga'
import Api from 'api'

describe('Repos duck', () => {
  let api: Api
  let testEnv: Record<string, string>
  let store: Store<State>
  let promisedState: Promise<State>

  const { start, abort } = fetchReposActions

  beforeAll(() => {
    testEnv = Api.getTesEnv()
    api = new Api(testEnv.githubToken)

    const sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(saga, api)
  })

  it('Initial state', () => {
    expect(store.getState()).toEqual({
      items: [],
      status: 'IDLE',
      progress: null,
      error: null
    })
  })

  it('START sets correct state', () => {
    store.dispatch(start(testEnv.user))
    promisedState = waitForState(store)
    expect(store.getState().status).toEqual('IN_PROGRESS')
  })

  it('COMPLETE sets correct state in single page case', () => {
    return expect(promisedState).resolves.toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            name: testEnv.userRepo
          })
        ]),
        progress: null,
        status: 'FULL',
        error: null
      })
    )
  })

  // describe('with mocked fetch', () => {
  //   const realFetch = window.fetch

  //   afterAll(() => {
  //     window.fetch = realFetch
  //   })

  //   it('FAILURE sets correct state', () => {
  //     window.fetch = jest.fn().mockRejectedValueOnce(new Error('NONONO'))

  //     store.dispatch(request(testEnv.user))
  //     promisedState = waitForState(store)

  //     return expect(promisedState).resolves.toEqual(
  //       expect.objectContaining({
  //         isFetching: false,
  //         error: expect.any(Error)
  //       })
  //     )
  //   })
  // })
})
