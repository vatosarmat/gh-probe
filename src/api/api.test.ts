import Api from './api'

describe('API layer', () => {
  let api: Api
  let testEnv: Record<string, string>

  beforeAll(() => {
    testEnv = Api.getTesEnv()
    api = new Api(testEnv.githubToken)
  })

  describe('searchUser - search user or organization', () => {
    it('Fetches SearchResult', () => {
      return expect(api.searchUser(testEnv.user)).resolves.toEqual(
        expect.objectContaining({
          total_count: expect.any(Number),
          incomplete_results: expect.any(Boolean),

          items: expect.arrayContaining([
            expect.objectContaining({
              login: testEnv.user,
              type: 'User',
              avatar_url: expect.any(String)
            })
          ])
        })
      )
    })

    it('Successive call aborts previous one', () => {
      return Promise.all([
        expect(api.searchUser(testEnv.user)).rejects.toEqual(expect.anything()),
        expect(api.searchUser(testEnv.user)).resolves.toEqual(expect.anything())
      ])
    })
  })

  describe('fetchUser - fetches user information', () => {
    it('Fetches User', () => {
      return expect(api.fetchUser(testEnv.user)).resolves.toEqual(
        expect.objectContaining({
          login: testEnv.user,
          bio: testEnv.userBio
        })
      )
    })
  })

  describe('fetchRepos - fetches user repos', () => {
    it('Single page case', () => {
      return expect(api.fetchRepos(testEnv.user).next()).resolves.toEqual(
        expect.objectContaining({
          value: expect.arrayContaining([
            expect.objectContaining({
              name: testEnv.userRepo
            })
          ]),
          done: true
        })
      )
    })

    it('Multi-page case', () => {
      return expect(api.fetchRepos(testEnv.userWithManyRepos).next()).resolves.toEqual(
        expect.objectContaining({
          value: expect.objectContaining({
            length: 100
          }),
          done: false
        })
      )
    })

    it('Abort', () => {
      const pager = api.fetchRepos(testEnv.user)
      const prom = pager.next()
      pager.abort()

      return expect(prom).rejects.toEqual(expect.anything())
    })
  })
})
