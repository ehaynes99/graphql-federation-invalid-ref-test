import path from 'node:path'

import { type GraphqlApi, startServer } from '../common/server.js'
import { RESOLVERS } from './identity-resolver.js'

const schemaPath = path.join(import.meta.dirname, 'schema')

export const startIdentityServer = async (): Promise<GraphqlApi> => {
  return await startServer({
    port: 4110,
    schemaPath,
    resolvers: RESOLVERS,
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startIdentityServer()
    .then((server) => {
      console.log(`Identity server running on ${server.address}`)
    })
    .catch(console.error)
}
