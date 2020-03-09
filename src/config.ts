export const primaryColorTuple = ['indigo', 'purple', 'teal'] as const
export type PrimaryColor = typeof primaryColorTuple[number]
export const defaultPrimaryColor: PrimaryColor = 'indigo'

export const reposPerPageTuple = [5, 10, 15, 20] as const
export type ReposPerPage = typeof reposPerPageTuple[number]
export const defaultReposPerPage: ReposPerPage = 10

export const appConfig = {
  exampleUsers: ['piotrwitek', 'gaearon', 'tj', 'mozilla', 'microsoft'],
  searchResultsCount: 20,
  title: 'GitHub repos',
  ghApiBaseUrl: (process.env.REACT_APP_GITHUB_API_BASE_URL ?? (window as any).REACT_APP_GITHUB_API_BASE_URL) as string,
  ghToken: process.env.REACT_APP_GITHUB_TOKEN,
  padding: {
    topBar: {
      xs: 1.5
    },
    searchUserForm: {
      xs: 2,
      md: 4
    },
    searchResultItem: {
      xs: {
        horizontal: 2,
        vertical: 1
      },
      md: {
        horizontal: 4,
        vertical: 1.5
      }
    },
    userCard: 2,
    repoListControl: 2,
    repoListItem: 2
  }
}
