export const primaryColorTuple = ['indigo', 'purple', 'teal'] as const
export type PrimaryColor = typeof primaryColorTuple[number]
export const defaultPrimaryColor: PrimaryColor = 'indigo'

export const reposPerPageTuple = [5, 10, 15, 20] as const
export type ReposPerPage = typeof reposPerPageTuple[number]
export const defaultReposPerPage: ReposPerPage = 10

export const appConfig = {
  exampleUsers: ['piotrwitek', 'gaearon', 'tj', 'mozilla', 'microsoft'],
  title: 'GitHub repos',
  ghApiBaseUrl: (process.env.REACT_APP_GITHUB_API_BASE_URL ?? (window as any).REACT_APP_GITHUB_API_BASE_URL) as string,
  ghToken: process.env.REACT_APP_GITHUB_TOKEN,
  sidePadding: {
    xs: 1,
    sm: 1.5
  }
}
