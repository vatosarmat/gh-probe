import { stringify as qs } from 'query-string'
import parseLinkHeader from 'parse-link-header'
import camelCase from 'camelcase'

import { User, UserBrief, SearchResult, Repo, Page } from './types'

class FetchPager<T> implements AsyncIterableIterator<T> {
  private abortController: AbortController | null = null
  private current: number = 1
  private total: number = 1

  constructor(
    private nextUrl: string | null,
    private readonly creator: (arg: any) => T = arg => arg
  ) {}

  [Symbol.asyncIterator] = () => this

  next = (): Promise<Page<T>> => {
    if (!this.nextUrl) {
      throw Error('Trying to fetch without nextUrl')
    }

    this.abortController = new AbortController()

    return fetch(this.nextUrl, {
      signal: this.abortController.signal
    })
      .then(response => {
        this.nextUrl = null
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
      .then(data => {
        return {
          value: this.creator(data),
          current: this.current,
          total: this.total,
          done: !Boolean(this.nextUrl)
        }
      })
  }

  abort = () => {
    if (this.abortController) {
      this.abortController.abort()
    }
  }
}

export default class {
  static getTesEnv(): Record<string, string> {
    const ret: { [key: string]: any } = {}
    for (const param of [
      'TEST_USER',
      'TEST_USER_BIO',
      'TEST_USER_REPO',
      'TEST_USER_WITH_MANY_REPOS',
      'GITHUB_PROXY_BASE_URL'
    ]) {
      const value = process.env[param]
      if (!value) {
        throw Error('Test environment not properly configured. Missing parameter ' + param)
      }

      ret[camelCase(param.replace(/^TEST_/, ''))] = value
    }

    return ret
  }

  private abortController: AbortController | null = null

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
        items: result.items.map(({ type, login, avatar_url }: any) => ({ type, login, avatar_url }))
      }))
  }

  fetchUser = (username: string): Promise<User> => {
    const endpoint = `users/${username}`
    const params = {}

    return fetch(this.url(endpoint, params))
      .then(response => response.json())
      .then(({ type, login, avatar_url, name, bio, location, company, blog }: any) => ({
        type,
        login,
        avatar_url,
        name,
        bio,
        location,
        company,
        blog
      }))
  }

  fetchRepos = (username: string): FetchPager<Repo[]> => {
    const endpoint = `users/${username}/repos`
    const params = {
      per_page: 100
    }

    return new FetchPager<Repo[]>(this.url(endpoint, params), repos =>
      repos.map(
        ({
          id,
          name,
          description,
          language,
          stargazers_count,
          forks_count,
          updated_at,
          html_url,
          archived,
          fork
        }: any) => ({
          id,
          name,
          description,
          language,
          stargazers_count,
          forks_count,
          updated_at,
          html_url,
          archived,
          fork
        })
      )
    )
  }
}
