import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { composeServices } from '@apollo/composition'

const appDir = path.resolve(import.meta.dirname, '../../src')

const identitySchema = readFileSync(path.join(appDir, 'identity-service/schema/identity.graphqls'), 'utf8')
const orderSchema = readFileSync(path.join(appDir, 'order-service/schema/order.graphqls'), 'utf8')

const services = [
  {
    name: 'identity',
    url: 'http://identity-server:4110/graphql',
    typeDefs: identitySchema,
  },
  {
    name: 'orders',
    url: 'http://order-server:4111/graphql',
    typeDefs: orderSchema,
  },
]

try {
  const result = composeServices(services)

  if (result.errors?.length) {
    console.error('Composition errors:', result.errors)
    process.exit(1)
  }

  // Write the composed supergraph
  const schemaFile = path.join(import.meta.dirname, 'schema.graphql')
  writeFileSync(schemaFile, result.supergraphSdl)
  console.log(`Supergraph written to ${schemaFile}`)
} catch (error) {
  console.error('Failed to compose supergraph:', error)
  process.exit(1)
}
