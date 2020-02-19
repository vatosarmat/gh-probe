import path from 'path'
import { CANCEL } from 'redux-saga'
import { stringify as qs } from 'query-string'
import parseLinkHeader from 'parse-link-header'
import { pick } from 'lodash'

import { appConfig } from 'config'
import { User, UserBrief, SearchResult, SearchResultItem, Repo } from './gh-types'

export interface ReposPage<T extends Repo = Repo> {
  current: number
  total: number
  repos: T[]
  nextUrl?: string
}

function pickRepoFields(responseBody: any): Repo {
  return pick(responseBody, [
    'id',
    'name',
    'description',
    'language',
    'stargazers_count',
    'forks_count',
    'created_at',
    'updated_at',
    'pushed_at',
    'html_url',
    'branches_url',
    'archived',
    'fork',
    'default_branch'
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
  private readonly baseUrlObj = new URL(appConfig.ghApiBaseUrl)
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

    const prom = fetch(this.nextUrl, {
      signal: this.abortController.signal
    })
      .then(response => {
        if (!response.ok) {
          throw Error('fetchRepos error: ' + response.status)
        }

        this.nextUrl = undefined
        const link = response.headers.get('link')
        if (link) {
          const linkHeader = parseLinkHeader(link)
          if (linkHeader && linkHeader.next) {
            const nextUrlObj = new URL(linkHeader.next.url)
            nextUrlObj.protocol = this.baseUrlObj.protocol
            nextUrlObj.host = this.baseUrlObj.host
            nextUrlObj.pathname = path.join(this.baseUrlObj.pathname, nextUrlObj.pathname)

            this.nextUrl = nextUrlObj.toString()

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
        done: !this.nextUrl,

        value: {
          repos: data.map(pickRepoFields),
          current: this.current,
          total: this.total,
          nextUrl: this.nextUrl
        }
      }))
    ;(prom as any)[CANCEL] = this.abort

    return prom
  }

  abort = () => {
    if (this.abortController) {
      this.abortController.abort()
    }
  }
}

export class Api {
  private abortController?: AbortController
  private readonly baseUrl = appConfig.ghApiBaseUrl

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
      .then(response => {
        if (!response.ok) {
          throw Error('searchUser error: ' + response.status)
        }
        return response.json()
      })
      .then((result: SearchResult<any>) => ({
        ...result,
        items: result.items.map(pickUsersSearchResultItemFields)
      }))
  }

  fetchUser = (username: string): Promise<User> => {
    const endpoint = `users/${username}`
    const params = {}

    return fetch(this.url(endpoint, params))
      .then(response => {
        if (!response.ok) {
          throw Error('fetchUser error: ' + response.status)
        }
        return response.json()
      })
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
