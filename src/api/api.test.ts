import Api from './api'

describe('API layer', () => {
  let api: Api
  const testUser = process.env.TEST_USER!
  const testUserBio = process.env.TEST_USER_BIO!
  const testRepo = process.env.TEST_REPO!
  const testUserManyRepos = process.env.TEST_USER_MANY_REPOS!

  beforeAll(() => {
    const token = process.env.GITHUB_TOKEN!

    if (!(token && testUser && testUserBio && testRepo && testUserManyRepos)) {
      throw Error('Test environment not properly configured')
    }

    api = new Api(token)
  })

  describe('searchUser - search user or organization', () => {
    it('Fetches SearchResult', () => {
      return expect(api.searchUser(testUser)).resolves.toEqual(
        expect.objectContaining({
          total_count: expect.any(Number),
          incomplete_results: expect.any(Boolean),

          items: expect.arrayContaining([
            expect.objectContaining({
              login: testUser,
              type: 'User',
              avatar_url: expect.any(String)
            })
          ])
        })
      )
    })

    it('Successive call aborts previous one', () => {
      return Promise.all([
        expect(api.searchUser(testUser)).rejects.toEqual(expect.anything()),
        expect(api.searchUser(testUser)).resolves.toEqual(expect.anything())
      ])
    })
  })

  describe('fetchUser - fetches user information', () => {
    it('Fetches User', () => {
      return expect(api.fetchUser(testUser)).resolves.toEqual(
        expect.objectContaining({
          login: testUser,
          bio: testUserBio
        })
      )
    })
  })

  describe('fetchRepos - fetches user repos', () => {
    it('Fetches repos, single page case', () => {
      return expect(api.fetchRepos(testUser).next()).resolves.toEqual(
        expect.objectContaining({
          value: expect.arrayContaining([
            expect.objectContaining({
              name: testRepo
            })
          ]),
          done: true
        })
      )
    })

    it('Fetches repos, multi-page case', () => {
      return expect(api.fetchRepos(testUserManyRepos).next()).resolves.toEqual(
        expect.objectContaining({
          value: expect.objectContaining({
            length: 100
          }),
          done: false
        })
      )
    })
  })
})
