import { describe, expect, it } from 'vitest'

const ROUTERS = [
  {
    name: 'Apollo Router',
    url: 'http://localhost:4100/graphql',
  },
  {
    name: 'WunderGraph (Cosmo)',
    url: 'http://localhost:4101/graphql',
  },
]

describe.each(ROUTERS)('Federation Router: $name', ({ url }) => {
  it('resolves orders correctly', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'GetOrder',
        query: `
          query GetOrder {
            order(id: "order1") {
              id
              numItems
              user {
                id
                email
              }
            }
          }
        `,
      }),
    })

    expect(response.status).toBe(200)
    const result = await response.json()

    expect(result).toEqual({
      data: {
        order: {
          id: 'order1',
          numItems: 5,
          user: {
            id: 'user1',
            email: 'user1@example.com',
          },
        },
      },
    })
  })

  it('should handle invalid user reference gracefully', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetOrder {
            order(id: "order2") {
              id
              numItems
              user {
                id
                email
              }
            }
          }
        `,
        operationName: 'GetOrder',
      }),
    })

    expect(response.status).toBe(200)

    const result = await response.json()

    // Expected behavior: user should be null when reference is invalid
    // Both routers handle this correctly by returning user: null in data
    // The errors/extensions are expected when non-nullable fields can't be resolved
    expect(result.data).toEqual({
      order: {
        id: 'order2',
        numItems: 3,
        user: null,
      },
    })
    expect(result.errors).toBeUndefined()
  })
})
