export const userTypeTuple = ['User', 'Organization'] as const

export type UserType = typeof userTypeTuple[number]

export interface UserSearchResultItem {
  type: UserType
  login: string
  avatarUrl: string
}

export interface User extends UserSearchResultItem {
  name: string | null
  location: string | null
  websiteUrl: string | null

  //User
  bio?: string | null
  company?: string | null

  //Organization
  description?: string | null
}

export interface Language {
  color: string | null
  name: string
}

export interface Repo {
  name: string
  description: string | null
  primaryLanguage: Language | null
  url: string
  isArchived: boolean
  createdAt: string
  pushedAt: string | null

  starsCount: number
  forksCount: number
}

export interface ReposPage {
  repos: Repo[]
  cursor: string
  totalReposCount: number
}
