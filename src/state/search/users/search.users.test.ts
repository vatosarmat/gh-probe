import { createStore, applyMiddleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer, { searchUsersActions, State } from './reducer'
import saga from './saga'
import Api from 'api'

export async function waitForState<State>(store: Store) {
  return new Promise<State>(resolve => {
    const unsubscribe = store.subscribe(() => {
      resolve(store.getState())
      unsubscribe()
    })
  })
}

describe('Search-users duck', () => {
  let api: Api
  let testEnv: Record<string, string>
  let store: Store<State>
  let promisedState: Promise<State>

  const { request } = searchUsersActions

  beforeAll(() => {
    testEnv = Api.getTesEnv()
    api = new Api(testEnv.githubToken)

    const sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(saga, api)
  })

  it('Initial state', () => {
    expect(store.getState()).toEqual({
      result: [],
      inProgress: false,
      error: null
    })
  })

  it('REQUEST-SUCCESS sets correct state', () => {
    store.dispatch(request(testEnv.user))
    promisedState = waitForState(store)
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
        inProgress: false,
        error: null
      })
    )
  })

  it('REQUEST sets correct state', () => {
    fetchMock.mock('http://example.com', 200)
    store.dispatch(request(testEnv.user))
    promisedState = waitForState(store)
    expect(store.getState().inProgress).toBeTruthy()
  })

  it('FAILURE sets correct state', () => {
    return expect(promisedState).resolves.toEqual(
      expect.objectContaining({
        inProgress: false,
        error: expect.any(Error)
      })
    )
  })
})
