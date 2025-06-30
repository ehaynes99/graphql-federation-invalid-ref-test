type OrderRef = { id: string }

type Order = {
  id: string
  user: { id: string }
  numItems: number
}

const ORDERS: Record<string, Order> = {
  order1: {
    id: 'order1',
    user: { id: 'user1' },
    numItems: 5,
  },
  order2: {
    id: 'order2',
    user: { id: 'missing-user' },
    numItems: 3,
  },
}

export const RESOLVERS = {
  Order: {
    __resolveReference: (ref: OrderRef): OrderRef | null => {
      return ORDERS[ref.id] ? ref : null
    },
    user: (ref: OrderRef): { id: string } => {
      return ORDERS[ref.id].user
    },
    numItems: (ref: OrderRef): number => {
      return ORDERS[ref.id].numItems
    },
  },
  Query: {
    order: (parent: null, args: { id: string }): Order | null => {
      return ORDERS[args.id] || null
    },
    orders: (): Order[] => {
      return Object.values(ORDERS)
    },
  },
}
