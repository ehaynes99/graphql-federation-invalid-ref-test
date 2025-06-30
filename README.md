# Cosmo Apollo Comparison

Compares the handling of dangling references between federated services using both Cosmo and Apollo.

The identity service resolves a simple user type. The order service resolves an order type that has the id of user associated with the order. In the order schema, it defines an unresolvable type for `User` containing only the id property.

```graphl
type User @key(fields: "id", resolvable: false) {
  id: ID!
}
```

The order service does not know the current state of the user. If the user id for an order is not resolvable by the identity service, we expect the user property of an order to be `null`, and thus the user property is declared as nullable. This is a common patter in distributed systems, where each has a single focus of responsibility and merely retains references to data owned by other services.

In Apollo, this behaves as expected: it returns the user as null and supplies diagnostic info about the user's properties being unresolvable:
```json
{
  "data": {
    "order": {
      "id": "order2",
      "numItems": 3,
      "user": null
    }
  },
  "extensions": {
    "valueCompletion": [
      {
        "message": "Cannot return null for non-nullable field User.email",
        "path": [
          "order",
          "user"
        ]
      }
    ]
  }
}
```

Cosmo also returns the data as expected, but it reports this as an error:

```json
{
  "data": {
    "order": {
      "id": "order2",
      "numItems": 3,
      "user": null
    }
  },
  "errors": [
    {
      "message": "Failed to fetch from Subgraph 'identity' at Path 'order.user', Reason: no data or errors in response.",
      "extensions": {
        "statusCode": 200
      }
    },
    {
      "message": "Cannot return null for non-nullable field 'Query.order.user.email'.",
      "path": [
        "order",
        "user",
        "email"
      ]
    }
  ]
}
```

This is a fundamental difference, because client code receiving the latter response will fail.
