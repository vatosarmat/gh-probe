import { keyBy, cloneDeep } from 'lodash'

import { User, SearchResult, UserBrief } from 'services/api'
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

  const networkError = new Error('No internet connection')

  const defaultState = cloneDeep(_defaultState)

  return {
    usersArray,
    users,
    usersSearchQuery,
    usersSearchResultResponseBody,
    usersSearchResult,
    networkError,
    defaultState
  }
}
