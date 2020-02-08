export class Api {
  searchUser = jest.fn()

  fetchUser = jest.fn()

  fetchRepos = jest.fn()

  fetchLastCommitDate = jest.fn()
}

export class ReposPager {
  next = jest.fn()

  abort = jest.fn()
}
