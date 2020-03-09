export const userTypeTuple = ['User', 'Organization'] as const

export type UserType = typeof userTypeTuple[number]

export interface SearchUserResultItem {
  id: string
  type: UserType
  login: string
  avatarUrl: string
}

export interface User extends SearchUserResultItem {
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
  id: string
  color: string | null
  name: string
}

export interface Repo {
  id: string
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
  lastRepoCursor: string
  hasNextPage: boolean
  totalReposCount: number
}
