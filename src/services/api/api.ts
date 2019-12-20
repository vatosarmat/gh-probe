import { stringify as qs } from 'query-string'
import parseLinkHeader from 'parse-link-header'
import { pick } from 'lodash'

import { User, UserBrief, SearchResult, SearchResultItem, Repo } from './gh-types'

export interface ReposPage {
  current: number
  total: number
  repos: Repo[]
}

function pickRepoFields(responseBody: any): Repo {
  return pick(responseBody, [
    'id',
    'name',
    'description',
    'language',
    'stargazers_count',
    'forks_count',
    'updated_at',
    'html_url',
    'archived',
    'fork'
  ])
}

function pickUserFields(responseBody: any): User {
  return pick(responseBody, ['id', 'type', 'login', 'avatar_url', 'name', 'bio', 'location', 'company', 'blog'])
}

function pickUsersSearchResultItemFields(responseBody: any): SearchResultItem<UserBrief> {
  return pick(responseBody, ['id', 'type', 'login', 'avatar_url', 'score'])
}

export class ReposPager implements AsyncIterableIterator<ReposPage> {
  private abortController?: AbortController
  private nextUrl?: string
  private current: number = 1
  private total: number = 1

  constructor(nextUrl: string) {
    this.nextUrl = nextUrl
  }

  [Symbol.asyncIterator] = () => this

  next = (): Promise<IteratorResult<ReposPage, ReposPage>> => {
    if (!this.nextUrl) {
      throw Error('Trying to fetch without nextUrl')
    }

    this.abortController = new AbortController()

    return fetch(this.nextUrl, {
      signal: this.abortController.signal
    })
      .then(response => {
        this.nextUrl = undefined
        const link = response.headers.get('link')
        if (link) {
          const linkHeader = parseLinkHeader(link)
          if (linkHeader && linkHeader.next) {
            this.nextUrl = linkHeader.next.url

            this.total = parseInt(linkHeader.last.page)
            this.current = parseInt(linkHeader.next.page) - 1
          } else {
            //we either on last page or have only one page
            this.current = this.total
          }
        }

        return response.json()
      })
      .then(data => ({
        done: !Boolean(this.nextUrl),

        value: {
          repos: data.map(pickRepoFields),
          current: this.current,
          total: this.total
        }
      }))
  }

  abort = () => {
    if (this.abortController) {
      this.abortController.abort()
    }
  }
}

export class Api {
  private abortController?: AbortController

  constructor(private readonly baseUrl: string) {}

  private url(endpoint: string, params: { [key: string]: any }): string {
    return `${this.baseUrl}/${endpoint}?${qs(params)}`
  }

  searchUser = (q: string): Promise<SearchResult<UserBrief>> => {
    const endpoint = 'search/users'
    const params = {
      q,
      per_page: 10
    }

    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    return fetch(this.url(endpoint, params), {
      signal: this.abortController.signal
    })
      .then(response => response.json())
      .then((result: SearchResult<any>) => ({
        ...result,
        items: result.items.map(pickUsersSearchResultItemFields)
      }))
  }

  fetchUser = (username: string): Promise<User> => {
    const endpoint = `users/${username}`
    const params = {}

    return fetch(this.url(endpoint, params))
      .then(response => response.json())
      .then(pickUserFields)
  }

  fetchRepos = (username: string): ReposPager => {
    const endpoint = `users/${username}/repos`
    const params = {
      per_page: 100
    }

    return new ReposPager(this.url(endpoint, params))
  }
}