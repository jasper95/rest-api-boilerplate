import {
  SchemaBuilder,
  QueryWrapper
} from 'knex-wrapper'
import knex from 'knex'
import util from 'util'
import db_schema from '../../config/db_schema'

export default (self) => {
  const config = {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    }
  }
  const { database, port, host } = config.connection
  const handler = {
    get(target, prototype, receiver) {
      const targetValue = Reflect.get(target, prototype, receiver)
      if (prototype in Object.getPrototypeOf(target) && !prototype.includes('_')
       && typeof targetValue === 'function') {
        return (...args) => {
          self.log('info', '%s - %s Params:', target.constructor.name, prototype, util.inspect(args))
          return targetValue.apply(target, args)
        }
      }
      return targetValue
    }
  }
  const query_wrapper = new Proxy(new QueryWrapper(db_schema, knex, config), handler)
  self.DB = query_wrapper
  self.knex = query_wrapper.knex
  const schema_builder = new SchemaBuilder(db_schema, query_wrapper)
  return schema_builder.setupSchema()
    .then(() => self.log('info', 'Connected to Database [Connection: %s:%s, Name: %s]', host, port, database))
    .catch(err => self.log('error', 'Error setting up schema [Error: %s]', util.inspect(err)))
}
