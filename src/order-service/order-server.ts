import path from 'node:path'

import { type GraphqlApi, startServer } from '../common/server.js'
import { RESOLVERS } from './order-resolver.js'

const schemaPath = path.join(import.meta.dirname, 'schema')

export const startOrderServer = async (): Promise<GraphqlApi> => {
  return await startServer({
    port: 4111,
    schemaPath,
    resolvers: RESOLVERS,
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startOrderServer()
    .then((server) => {
      console.log(`Order server running on ${server.address}`)
    })
    .catch(console.error)
}
