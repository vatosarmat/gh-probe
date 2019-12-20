import { keyBy, cloneDeep } from 'lodash'

import { User } from 'services/api'
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

  const networkError = new Error('No internet connection')

  const defaultState = cloneDeep(_defaultState)

  return {
    usersArray,
    users,
    networkError,
    defaultState
  }
}
