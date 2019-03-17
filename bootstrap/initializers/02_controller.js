import {
  createProxy,
  readDirPromise
} from '../../utils'

export default (self) => {
  const app = `${process.cwd()}/app`
  const proxyHandler = (targetValue, { prototype, target }, ...args) => {
    const { log } = self
    const class_name = target.constructor.name
    const [req, res] = args
    log('info', '%s - %s [Params: %s]', class_name, prototype, util.inspect(req.params))
    if (req.authenticated) {
      return targetValue.apply(target, args)
        .then(response => res.send(200, response))
        .catch((err) => {
          if (err.success === false) {
            log('warn', '%s - %s [Error: %s]', class_name, prototype, err.message)
            return res.send(400, { code: 'BadRequest', message: err.message })
          }
          log('error', '%s - %s [Error: %s]', class_name, prototype, util.inspect(err))
          return res.send(500, { code: 'InternalError', message: util.inspect(err) })
        })
    }
    log('warn', '%s - %s [Error: %s]', class_name, prototype, util.inspect(req.auth_error))
    return res.send(401, { code: 'Unauthorized', message: util.inspect(req.auth_error) })
  }

  const { server } = self
  const initRoutes = (module_name) => {
    const routes = require(`${app}/${module_name}/routes`).default //eslint-disable-line
    let controller = new (require(`${app}/${module_name}/controller`).default)(self) // eslint-disable-line
    controller = createProxy(controller, proxyHandler)
    Object.entries(routes).forEach(([verb, handlers]) => {
      handlers.forEach(({ url, handler }) => {
        server[verb](url, controller[handler])
      })
    })
  }
  return readDirPromise(app)
    .map((module_name) => {
      if (module_name !== 'base') {
        initRoutes(module_name)
      }
      return null
    })
    .then(() => initRoutes('base'))
}
