export const uerTypeTuple = ['User', 'Organization'] as const

export type UserType = typeof uerTypeTuple[number]

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

export interface SearchResult<T> {
  total_count: number
  incomplete_results: boolean
  items: T[]
}

export interface Repo {
  id: number
  name: string
  description: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: Date
  html_url: string
  archived: boolean
  fork: boolean
}
