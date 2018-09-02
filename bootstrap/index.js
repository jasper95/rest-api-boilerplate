import bluebird from 'bluebird'
import fs from 'fs'
import path from 'path'
import util from 'util'

bluebird.promisifyAll(fs)

export default async ({ server, log }) => {
  const createProxy = (object, cb) => {
    const handler = {
      get(target, prototype, receiver) {
        const targetValue = Reflect.get(target, prototype, receiver)
        if (prototype in Object.getPrototypeOf(target) && typeof targetValue === 'function') {
          return (...args) => cb(targetValue, { target, prototype }, ...args)
        }
        return targetValue
      }
    }
    return new Proxy(object, handler)
  }
  const context = { server, log, createProxy }
  const dir = path.resolve(__dirname, './initializers')
  return fs.readdirAsync(dir)
    .then(files => files.sort())
    .mapSeries((file) => {
      const { default: initializer } = require(`${dir}/${file}`) // eslint-disable-line
      initializer(context)
      return null
    })
    .catch(err => log('error', util.inspect(err)))
}
