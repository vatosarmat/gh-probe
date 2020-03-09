import { CANCEL } from 'redux-saga'
import { pick } from 'lodash'

import { SearchUserResultItem, User, Repo, ReposPage } from './types'
import { appConfig } from 'config'

export * from './types'

const { ghApiBaseUrl, ghToken, searchResultsCount, reposPageLength } = appConfig

const endpoint = `${ghApiBaseUrl}/graphql`
const requestInit = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    ...(ghToken
      ? {
          Authorization: `token ${ghToken}`
        }
      : {})
  }
}

const gqlFetch = (query: string) => {
  const abortController = new AbortController()
  const prom = fetch(endpoint, {
    ...requestInit,
    body: JSON.stringify({
      query
    })
  })
  ;(prom as any)[CANCEL] = () => abortController.abort()

  return prom.then(response => {
    if (!response.ok) {
      throw Error('gqlFetch error: ' + response.status)
    }
    return response.json()
  })
}

const pickReposPage = (repositories?: {
  totalReposCount: number
  edges?: any[]
  pageInfo: { hasNextPage: boolean }
}): ReposPage =>
  repositories?.edges
    ? {
        totalReposCount: repositories.totalReposCount,
        lastRepoCursor: repositories.edges[repositories.edges.length - 1].cursor,
        hasNextPage: repositories.pageInfo.hasNextPage,
        repos: repositories.edges.map(
          ({ node }: any): Repo =>
            Object.assign(
              pick(node, [
                'id',
                'name',
                'description',
                'primaryLanguage',
                'createdAt',
                'pushedAt',
                'isArchived',
                'url'
              ]),
              {
                starsCount: node.stargazers.totalCount,
                forksCount: node.stargazers.totalCount
              }
            )
        )
      }
    : {
        lastRepoCursor: '',
        totalReposCount: 0,
        repos: [],
        hasNextPage: false
      }

export const searchUser = (query: string): Promise<SearchUserResultItem[]> =>
  gqlFetch(`
  {
    search(type: USER, query: "${query}", first: ${searchResultsCount}) {
      nodes {
        type: __typename
        ... on RepositoryOwner {
          id
          login
          avatarUrl
        }
      }
    }
  }
`).then(obj => obj?.data?.search?.nodes)

export const fetchUserAndRepos = (ownerLogin: string): Promise<[User, ReposPage]> =>
  gqlFetch(`
  {
    repositoryOwner(login: "${ownerLogin}") {
      type: __typename
      ... on ProfileOwner {
        id
        login
        name
        location
        websiteUrl
      }
      ... on User {
        avatarUrl
        bio
        company
      }
      ... on Organization {
        avatarUrl
        description
      }
      repositories(ownerAffiliations: [OWNER], privacy: PUBLIC, isFork: false, first: ${reposPageLength}) {
        totalReposCount:totalCount
        pageInfo{
          hasNextPage
        }
        edges {
          lastRepoCursor:cursor
          node {
            id
            name
            description
            primaryLanguage {
              name
              color
            }
            createdAt
            pushedAt
            isArchived
            url
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }
`).then(obj => {
    const repositoryOwner = obj?.data?.repositoryOwner
    const repositories = repositoryOwner?.repositories

    if (!repositoryOwner) {
      throw new Error('Bad response')
    }

    const user: User = pick(repositoryOwner, [
      'id',
      'type',
      'login',
      'name',
      'location',
      'websiteUrl',
      'avatarUrl',
      'bio',
      'company',
      'description'
    ])

    return [user, pickReposPage(repositories)]
  })

export const fetchReposAfterCursor = (ownerLogin: string, cursor: string): Promise<ReposPage> =>
  gqlFetch(`
  {
    repositoryOwner(login: "${ownerLogin}") {
      repositories(ownerAffiliations: [OWNER], privacy: PUBLIC, isFork: false, first: ${reposPageLength}, after: "${cursor}") {
        totalReposCount: totalCount
        edges {
          lastRepoCursor:cursor
          pageInfo{
            hasNextPage
          }
          node {
            id
            name
            description
            primaryLanguage {
              name
              color
            }
            createdAt
            pushedAt
            isArchived
            url
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }
`).then(obj => pickReposPage(obj?.data?.repositoryOwner?.repositories))
