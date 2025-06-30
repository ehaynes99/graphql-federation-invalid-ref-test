import { createLogger } from 'graphql-yoga'

type UserRef = { id: string }

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
}

const log = createLogger('info')

const USERS: Record<string, User> = {
  user1: {
    id: 'user1',
    email: 'user1@example.com',
    firstName: 'Joe',
    lastName: 'Schmoe',
  },
  user2: {
    id: 'user2',
    email: 'user2@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
  },
}

export const RESOLVERS = {
  User: {
    __resolveReference: (ref: UserRef): UserRef | null => {
      log.info('!!!!!!!!!!!!!!!! __resolveReference called for user: ', ref)
      return USERS[ref.id] ? ref : null
    },
    email: (ref: UserRef): string => {
      log.info('!!!!!!!!!!!!!!!! email resolver called for user: ', ref)
      return USERS[ref.id].email
    },
    firstName: (ref: UserRef): string => {
      log.info('!!!!!!!!!!!!!!!! firstName resolver called for user: ', ref)
      return USERS[ref.id].firstName
    },
    lastName: (ref: UserRef): string => {
      log.info('!!!!!!!!!!!!!!!! lastName resolver called for user: ', ref)
      return USERS[ref.id].lastName
    },
  },
  Query: {
    user: (_: null, ref: UserRef): User | null => {
      return USERS[ref.id] || null
    },
  },
}
