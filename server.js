import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import winston from 'winston'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bootstrap from './bootstrap'

dotenv.config() // load env-variables


const APP_NAME = process.env.npm_package_name
const ENV = process.env.NODE_ENV || 'default'

const PORT = process.env.LISTEN_PORT || 5000

const server = restify.createServer({
  name: APP_NAME,
  version: process.env.npm_package_version
})

const cors = corsMiddleware({
  preflightMaxAge: 1000,
  origins: ['*'],
  allowHeaders: ['Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Token, Authorization'],
  exposeHeaders: ['X-Api-Version, X-Request-Id, X-Response-Time']
})

winston.remove(winston.transports.Console)

const logger = winston.add(winston.transports.Console, {
  timestamp: true,
  colorize: true
})

const log = {
  stream: {
    write: message => logger.info(message)
  },
  message: ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
}

global.log = (level = 'info', message, ...args) => {
  winston[level](message, ...args)
}

server.pre(cors.preflight)
server.use(cors.actual)
server.use(morgan(log.message, { stream: log.stream }))
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.authorizationParser());


(async () => {
  await bootstrap(server)
  const message = `Application starting in ${ENV} environment on http://${APP_NAME}:${PORT}`
  server.listen(PORT, () => winston.info(message))
})()
