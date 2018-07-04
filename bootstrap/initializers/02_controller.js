export default (self) => {
  const controllers_path = `${process.cwd()}/src/controllers`
  const handler = {
    apply(target, context, args) {
      const [req, res] = args
      log('info', '%s - %s [Params: %s]', this.class, this.prototype, util.inspect(req.params))

      return Reflect.apply(target, context, args)
        .then(response => res.send(200, response))
        .catch((err) => {
          if (err.success === false) {
            log('warn', '%s - %s [Error: %s]', this.class, this.prototype, err.message)
            return res.send(400, { code: 'BadRequest', message: err.message })
          }
          log('error', '%s - %s [Error: %s]', this.class, this.prototype, util.inspect(err))
          return res.send(500, { code: 'InternalError', message: util.inspect(err) })
        })
    }
  }

  self.controllers = {}

  return fs
    .readdirAsync(controllers_path)
    .map((file) => {
      if (file && file.includes('.js')) {
        const Controller = new (require(`${controllers_path}/${file}`).default)() // eslint-disable-line
        self.controllers[file.split('.')[0]] = createProxy(Controller, handler)
      }
      return null
    })
}
