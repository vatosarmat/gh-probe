import { Effect, call, put, take } from 'redux-saga/effects'
import { pick, cloneDeep } from 'lodash'

import { userActions } from 'state'
import { Mutable } from 'utils/common'
import makeFx from './fixtures'
import { expectSagaState, api } from './helpers'

describe('Post add operation', () => {
  let fx: ReturnType<typeof makeFx>
  beforeEach(() => {
    fx = makeFx()
    jest.resetAllMocks()
  })

  const { add } = postsActions
  const { response } = sessionActions

  it('Success', () => {
    const author = fx.usersArray[0]
    const expectedPost = fx.postsByAuthor[author.id][0]
    const postData = fx.postDatas[expectedPost.id]
    ;(api.addPost as jest.Mock).mockResolvedValueOnce(expectedPost)

    const initialState = fx.defaultState as Mutable<State>
    initialState.session.user = author
    initialState.session.authorizedOnServer = true

    const expectedState = cloneDeep(initialState)
    expectedState.posts.items = pick(fx.posts, expectedPost.id)
    expectedState.posts.modify = { [NEW_POST_ID]: { status: 'SUCCESS', kind: 'add', result: expectedPost.id } }

    return expectSagaState({
      initialState,
      dispatchActions: [add.request(postData)],
      expectedState,
      expectedEffects: [[put(add.requested()), call(api.addPost, postData), put(add.success(expectedPost))]]
    })
  })
})
