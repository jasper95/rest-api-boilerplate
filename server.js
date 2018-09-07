import restify from 'restify'
import dotenv from 'dotenv'
import bootstrap from './bootstrap'
import {
  auth, logger, cors, request_logger
} from './middlewares'

dotenv.config() // load env-variables


const APP_NAME = process.env.npm_package_name
const ENV = process.env.NODE_ENV || 'default'

const PORT = process.env.LISTEN_PORT || 5000

const server = restify.createServer({
  name: APP_NAME,
  version: process.env.npm_package_version
})

const log = (level = 'info', message, ...args) => {
  logger[level](message, ...args)
}

server.pre(cors.preflight)
server.use(cors.actual)
server.use(request_logger)
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.authorizationParser())
server.use(auth);

(async () => {
  await bootstrap({ log, server })
  const message = `Application starting in ${ENV} environment on http://${APP_NAME}:${PORT}`
  server.listen(PORT, () => logger.info(message))
})()
