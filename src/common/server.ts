import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { buildSubgraphSchema } from '@apollo/subgraph'
import type { GraphQLResolverMap } from '@apollo/subgraph/src/schema-helper/resolverMap.js'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { createYoga } from 'graphql-yoga'

export type GraphqlApi = {
  address: string
  stop: () => Promise<void>
}

export type ServerOpts = {
  port?: number
  schemaPath: string
  resolvers: GraphQLResolverMap<unknown>
}

export const startServer = async ({ port, schemaPath, resolvers }: ServerOpts): Promise<GraphqlApi> => {
  const typesArray = loadFilesSync(`${schemaPath}/*.graphqls`)
  const typeDefs = mergeTypeDefs(typesArray)

  const yoga = createYoga({
    logging: 'debug',
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  })

  // Pass it into a server to hook into request handlers.
  const server = createServer(yoga as any)
  return new Promise((resolve) => {
    server.listen(port, '0.0.0.0', () => {
      const { port } = server.address() as AddressInfo
      resolve({
        address: `http://0.0.0.0:${port}/graphql`,
        stop: () =>
          new Promise<void>((resolve, reject) => {
            server.close((error: unknown) => {
              error ? reject(error) : resolve()
            })
          }),
      })
    })
  })
}
