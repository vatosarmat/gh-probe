export const uerTypeTuple = ['User', 'Organization'] as const

export type UserType = typeof uerTypeTuple[number]

export interface UserBrief {
  readonly type: UserType
  readonly login: string
  readonly avatar_url: string
}

export interface User extends UserBrief {
  readonly name: string | null
  readonly bio: string | null
  readonly location: string | null
  readonly company: string | null
  readonly blog: string | null
}

export interface SearchResult<T> {
  readonly total_count: number
  readonly incomplete_results: boolean
  readonly items: T[]
}

export interface Repo {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly language: string | null
  readonly stargazers_count: number
  readonly forks_count: number
  readonly updated_at: Date
  readonly html_url: string
  readonly archived: boolean
  readonly fork: boolean
}

export interface Page<T> extends IteratorResult<T> {
  readonly current: number
  readonly total: number
}

export type ReposPage = Page<Repo[]>
