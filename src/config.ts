export const primaryColorTuple = ['indigo', 'purple', 'teal'] as const
export type PrimaryColor = typeof primaryColorTuple[number]
export const defaultPrimaryColor: PrimaryColor = 'indigo'

export const reposPerPageTuple = [5, 10, 15, 20] as const
export type ReposPerPage = typeof reposPerPageTuple[number]
export const defaultReposPerPage: ReposPerPage = 10

const origin = ((window as any).ORIGIN as string) ?? ''
const basename = ((window as any).BASENAME as string) ?? ''

export const appConfig = {
  exampleUsers: ['sindresorhus', 'ai', 'tj', 'mozilla', 'microsoft'],
  searchUserLabel: 'Search user',
  emptySearchQueryTooltip: 'Query must be non-empty',
  searchResultsCount: 20,
  reposPageLength: 100,
  title: 'GitHub repos',
  //local ?? docker
  ghApiBaseUrl: process.env.REACT_APP_GITHUB_API_BASE_URL ?? `${origin}${basename}/gh-api`,
  routerBasename: basename,
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
