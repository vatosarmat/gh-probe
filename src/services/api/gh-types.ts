export const userTypeTuple = ['User', 'Organization'] as const

export type UserType = typeof userTypeTuple[number]

export interface UserBrief {
  id: number
  type: UserType
  login: string
  avatar_url: string
}

export interface User extends UserBrief {
  name: string | null
  bio: string | null
  location: string | null
  company: string | null
  blog: string | null
}

export type SearchResultItem<T> = T & {
  score: number
}

export interface SearchResult<T> {
  total_count: number
  incomplete_results: boolean
  items: SearchResultItem<T>[]
}

export interface Repo {
  id: number
  name: string
  description: string
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  html_url: string
  branches_url: string
  archived: boolean
  fork: boolean
  default_branch: string
}
