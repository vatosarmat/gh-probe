import { stringify as qs } from 'query-string'
import parseLinkHeader from 'parse-link-header'

import { User, UserBrief, SearchResult, Repo } from './types'

class FetchPager<T> implements AsyncIterableIterator<T> {
  private abortController: AbortController = new AbortController()

  private currentLinkHeader: parseLinkHeader.Links | null = null

  constructor(
    private nextUrl: string | null,
    private readonly creator: (arg: any) => T = arg => arg
  ) {}

  [Symbol.asyncIterator] = () => this

  next(): Promise<IteratorResult<T>> {
    if (!this.nextUrl) {
      throw Error('Trying to fetch without nextUrl')
    }

    return fetch(this.nextUrl, {
      signal: this.abortController.signal
    })
      .then(response => {
        this.nextUrl = null
        const link = response.headers.get('link')
        if (link) {
          this.currentLinkHeader = parseLinkHeader(link)
          if (this.currentLinkHeader && this.currentLinkHeader.next) {
            this.nextUrl = this.currentLinkHeader.next.url
          }
        }

        return response.json()
      })
      .then(data => ({
        value: this.creator(data),
        done: !Boolean(this.nextUrl)
      }))
  }
}

export default class {
  private readonly baseUrl = 'https://api.github.com'
  private abortController: AbortController | null = null

  constructor(private readonly accessToken: string) {}

  private url(endpoint: string, params: { [key: string]: any }): string {
    return `${this.baseUrl}/${endpoint}?${qs(params)}`
  }

  searchUser(q: string): Promise<SearchResult<UserBrief>> {
    const endpoint = 'search/users'
    const params = {
      accessToken: this.accessToken,
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

  fetchUser(username: string): Promise<User> {
    const endpoint = `users/${username}`
    const params = {
      accessToken: this.accessToken
    }

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

  fetchRepos(username: string): FetchPager<Repo[]> {
    const endpoint = `users/${username}`
    const params = {
      accessToken: this.accessToken
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
          owner: { avatar_url }
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
          owner_avatar_url: avatar_url
        })
      )
    )
  }
}
