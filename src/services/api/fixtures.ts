import { keyBy, cloneDeep } from 'lodash'

import { SearchUserResultItem, User, ReposPage } from './types'
import { defaultState as _defaultState } from 'state'

export default function() {
  const usersArray: User[] = [
    {
      id: '123',
      type: 'User',
      login: 'vasiliy',
      name: 'Vasiliy Petrov',
      avatarUrl: 'no need for test',
      bio: 'Fullstack JS/TS developer',
      location: 'Russia',
      company: null,
      websiteUrl: null
    },

    {
      id: '456',
      type: 'Organization',
      login: 'microsoft',
      name: 'Microsoft corporation',
      avatarUrl: 'no need for test',
      bio: 'IT giant',
      location: 'USA, Redmond',
      company: null,
      websiteUrl: null
    }
  ]

  const users = keyBy(usersArray, 'id')

  const usersSearchQuery = 'vasiliy'

  const usersSearchResultItems: SearchUserResultItem[] = [
    {
      id: '123',
      type: 'User',
      login: 'vasiliy',
      avatarUrl: 'no need for test'
    },

    {
      id: '124',
      type: 'User',
      login: 'vasiliy2',
      avatarUrl: 'no need for test'
    },

    {
      id: '125',
      type: 'User',
      login: 'vasiliy23',
      avatarUrl: 'no need for test'
    }
  ]

  const usersSearchResult = keyBy(usersSearchResultItems, 'id')

  const singleReposPage: ReposPage = {
    totalReposCount: 1,
    hasNextPage: false,
    lastRepoCursor: '40',
    repos: [
      {
        id: '40',
        name: 'tic-tac-toe',
        description: 'Stupid game',
        primaryLanguage: {
          name: 'Scheme',
          color: 'red'
        },
        starsCount: 12,
        forksCount: 2,
        createdAt: 'Tue, 14 Nov 2019 13:25:45 GMT',
        pushedAt: 'Tue, 14 Nov 2019 13:25:45 GMT',
        url: 'github.com/vasiliy/tic-tac-toe',
        isArchived: false
      }
    ]
  }

  const reposPagesArray: ReposPage[] = [
    {
      totalReposCount: 2,
      hasNextPage: true,
      lastRepoCursor: '54',
      repos: [
        {
          id: '54',
          name: 'typescript',
          description: 'Type-safe language compiled to JS',
          primaryLanguage: {
            name: 'typescript',
            color: 'blue'
          },
          starsCount: 1312,
          forksCount: 131,
          createdAt: 'Tue, 14 Nov 2019 13:25:45 GMT',
          pushedAt: 'Tue, 14 Nov 2019 13:25:45 GMT',
          url: 'github.com/microsoft/typescript',
          isArchived: false
        }
      ]
    },
    {
      totalReposCount: 2,
      hasNextPage: false,
      lastRepoCursor: '55',
      repos: [
        {
          id: '55',
          name: 'vscode',
          description: 'Source code editor',
          primaryLanguage: {
            name: 'typescript',
            color: 'blue'
          },
          starsCount: 12000,
          forksCount: 2333,
          createdAt: 'Tue, 11 Nov 2019 3:25:45 GMT',
          pushedAt: 'Tue, 11 Nov 2019 3:25:45 GMT',
          url: 'github.com/microsoft/vscode',
          isArchived: false
        }
      ]
    }
  ]

  const networkError = new Error('No internet connection')

  const defaultState = cloneDeep(_defaultState)

  return {
    usersArray,
    users,
    usersSearchQuery,
    usersSearchResultItems,
    usersSearchResult,
    singleReposPage,
    reposPagesArray,
    networkError,
    defaultState
  }
}
