import util from 'util'
import fs from 'fs'
import bluebird from 'bluebird'

bluebird.promisifyAll(fs)

export default (self) => {
  const controllers_path = `${process.cwd()}/app/controllers`
  const handler = (targetValue, { prototype, target }, ...args) => {
    const class_name = target.constructor.name
    const [req, res] = args
    self.log('info', '%s - %s [Params: %s]', class_name, prototype, util.inspect(req.params))
    if (req.authenticated) {
      return targetValue.apply(target, args)
        .then(response => res.send(200, response))
        .catch((err) => {
          if (err.success === false) {
            self.log('warn', '%s - %s [Error: %s]', class_name, prototype, err.message)
            return res.send(400, { code: 'BadRequest', message: err.message })
          }
          self.log('error', '%s - %s [Error: %s]', class_name, prototype, util.inspect(err))
          return res.send(500, { code: 'InternalError', message: util.inspect(err) })
        })
    }
    self.log('warn', '%s - %s [Error: %s]', class_name, prototype, util.inspect(req.auth_error))
    return res.send(401, { code: 'Unauthorized', message: util.inspect(req.auth_error) })
  }

  self.controllers = {}
  return fs
    .readdirAsync(controllers_path)
    .map((file) => {
      if (file && file.includes('.js')) {
        const controller = new (require(`${controllers_path}/${file}`).default)(self) // eslint-disable-line
        self.controllers[file.split('.')[0]] = self.createProxy(controller, handler)
      }
      return null
    })
}
