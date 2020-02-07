import { keyBy, cloneDeep } from 'lodash'

import { User, SearchResult, UserBrief, ReposPage } from 'services/api'
import { defaultState as _defaultState } from 'state'

export default function() {
  const usersArray: User[] = [
    {
      id: 123,
      type: 'User',
      login: 'vasiliy',
      name: 'Vasiliy Petrov',
      avatar_url: 'no need for test',
      bio: 'Fullstack JS/TS developer',
      location: 'Russia',
      company: null,
      blog: null
    },

    {
      id: 456,
      type: 'Organization',
      login: 'microsoft',
      name: 'Microsoft corporation',
      avatar_url: 'no need for test',
      bio: 'IT giant',
      location: 'USA, Redmond',
      company: null,
      blog: null
    }
  ]

  const users = keyBy(usersArray, 'id')

  const usersSearchQuery = 'vasiliy'

  const usersSearchResultResponseBody: SearchResult<UserBrief> = {
    total_count: 3,
    incomplete_results: false,

    items: [
      {
        id: 123,
        type: 'User',
        login: 'vasiliy',
        avatar_url: 'no need for test',
        score: 5000
      },

      {
        id: 124,
        type: 'User',
        login: 'vasiliy2',
        avatar_url: 'no need for test',
        score: 500
      },

      {
        id: 125,
        type: 'User',
        login: 'vasiliy23',
        avatar_url: 'no need for test',
        score: 100
      }
    ]
  }

  const usersSearchResult = keyBy(usersSearchResultResponseBody.items, 'id')

  const singleReposPage: ReposPage = {
    total: 1,
    current: 1,
    repos: [
      {
        id: 40,
        name: 'tic-tac-toe',
        description: 'Stupid game',
        language: 'Scheme',
        stargazers_count: 12,
        forks_count: 2,
        created_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
        updated_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
        pushed_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
        html_url: 'github.com/vasiliy/tic-tac-toe',
        branches_url: 'github.com/vasiliy/tic-tac-toe/branches',
        archived: false,
        fork: false,
        default_branch: 'master'
      }
    ]
  }

  const reposPagesArray: ReposPage[] = [
    {
      total: 2,
      current: 1,
      repos: [
        {
          id: 54,
          name: 'typescript',
          description: 'Type-safe language compiled to JS',
          language: 'typescript',
          stargazers_count: 1312,
          forks_count: 131,
          created_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
          updated_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
          pushed_at: 'Tue, 14 Nov 2019 13:25:45 GMT',
          html_url: 'github.com/microsoft/typescript',
          branches_url: 'github.com/microsoft/typescript/branches',
          archived: false,
          fork: false,
          default_branch: 'master'
        }
      ]
    },
    {
      total: 2,
      current: 2,
      repos: [
        {
          id: 55,
          name: 'vscode',
          description: 'Source code editor',
          language: 'typescript',
          stargazers_count: 12000,
          forks_count: 2333,
          created_at: 'Tue, 11 Nov 2019 3:25:45 GMT',
          updated_at: 'Tue, 11 Nov 2019 3:25:45 GMT',
          pushed_at: 'Tue, 11 Nov 2019 3:25:45 GMT',
          html_url: 'github.com/microsoft/vscode',
          branches_url: 'github.com/microsoft/vscode/branches',
          archived: false,
          fork: false,
          default_branch: 'master'
        }
      ]
    }
  ]

  // IteratorResult<ReposPage, ReposPage>

  const networkError = new Error('No internet connection')

  const defaultState = cloneDeep(_defaultState)

  return {
    usersArray,
    users,
    usersSearchQuery,
    usersSearchResultResponseBody,
    usersSearchResult,
    singleReposPage,
    reposPagesArray,
    networkError,
    defaultState
  }
}
