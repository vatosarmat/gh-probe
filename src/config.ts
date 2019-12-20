export const primaryColorTuple = ['indigo', 'purple', 'teal'] as const
export type PrimaryColor = typeof primaryColorTuple[number]
export const defaultPrimaryColor: PrimaryColor = 'indigo'

export const reposPerPageTuple = [5, 10, 15, 20] as const
export type ReposPerPage = typeof reposPerPageTuple[number]
export const defaultReposPerPage: ReposPerPage = 10

export const exampleUsers = ['piotrwitek', 'gaearon', 'tj', 'mozilla', 'microsoft']
