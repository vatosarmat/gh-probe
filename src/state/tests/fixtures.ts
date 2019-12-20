import { User } from 'services/api'

export default function() {
  const usersArray: User[] = [
    {
      id: 123,
      name: 'Vasya',
      email: 'vasya-486@gmail.com',
      createdAt: 'Tue, 8 Nov 2019 13:25:45 GMT',
      updatedAt: 'Tue, 8 Nov 2019 13:25:45 GMT'
    },

    {
      id: 456,
      name: 'Johny',
      email: 'johny-486@gmail.com',
      createdAt: 'Tue, 9 Nov 2019 13:25:45 GMT',
      updatedAt: 'Tue, 9 Nov 2019 13:25:45 GMT'
    }
  ]

  return {
    usersArray
  }
}
