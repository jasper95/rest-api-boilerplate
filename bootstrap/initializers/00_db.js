import db_schema from '../../config/db_schema'
import {
    SchemaBuilder,
    QueryWrapper
} from 'knex-wrapper'
import knex from 'knex'

export default () => {
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
    let handler = {
        apply(target, context, args) {
            if(!this.prototype.includes('_'))
                log('info', '%s - %s Params:', this.class, this.prototype, util.inspect(args))
            return Reflect.apply(target, context, args)
        }
    }
    const query_wrapper = createProxy(new QueryWrapper(db_schema, knex, config), handler)
    global.DB = query_wrapper
    global.knex = query_wrapper.knex
    const schema_builder = new SchemaBuilder(db_schema, query_wrapper)
    return schema_builder.setupSchema()
            .then(() =>     log('info', 'Connected to Database [Connection: %s:%s, Name: %s]', host, port, database))
            .catch(err => log('error', 'Error setting up schema [Error: %s]', util.inspect(err)))
}