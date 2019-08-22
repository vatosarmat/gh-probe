import { createStore, applyMiddleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { waitForStateChange } from 'utils'
import reducer, { fetchReposActions, ReposState } from './reducer'
import saga from './saga'
import Api from 'concepts/api'

describe('Repos duck', () => {
  let api: Api
  let testEnv: Record<string, string>
  let store: Store<ReposState>

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
      username: '',
      items: [],
      status: 'IDLE',
      progress: null,
      error: null
    })
  })

  it('FETCH_START, FETCH_COMPLETE in single page case', () => {
    expect.assertions(2)

    store.dispatch(start(testEnv.user))
    expect(store.getState().status).toEqual('IN_PROGRESS')

    return expect(waitForStateChange(store)).resolves.toEqual(
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

  it('FETCH_START, FETCH_PAGE_READY, FETCH_ABORT in multi page case', async () => {
    expect.assertions(2)

    store.dispatch(start(testEnv.userWithManyRepos))

    await waitForStateChange(store)
    let state = await waitForStateChange(store)

    expect(state).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        progress: expect.objectContaining({
          current: 2,
          total: expect.any(Number)
        }),
        status: 'IN_PROGRESS',
        error: null
      })
    )

    store.dispatch(abort())
    expect(store.getState().status).toEqual('ABORTED')
  })

  describe('with mocked fetch', () => {
    const realFetch = window.fetch

    afterAll(() => {
      window.fetch = realFetch
    })

    it('FETCH_COMPLETE with error', () => {
      window.fetch = jest.fn().mockRejectedValueOnce(new Error('NONONO'))

      store.dispatch(start(testEnv.user))

      return expect(waitForStateChange(store)).resolves.toEqual(
        expect.objectContaining({
          status: 'ERROR',
          error: expect.any(Error)
        })
      )
    })
  })
})
