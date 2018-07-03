import bluebird from 'bluebird'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import util from 'util'

export default async (server) => {
  const createProxy = (object, handler) => {
    const prototypes = Object.getOwnPropertyNames(Object.getPrototypeOf(object))
    const proxied = prototypes.reduce((obj, key) => {
      obj[key] = new Proxy(object[key], Object.assign({
        class: object.constructor.name,
        prototype: key
      }, handler))

      return obj
    }, {})
    return Object.getOwnPropertyNames(object).reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, proxied)
  }

  global.Promise = bluebird
  global.fs = Promise.promisifyAll(fs)
  global.createProxy = createProxy
  global._ = _
  global.util = util

  const context = { server }
  const dir = path.resolve(__dirname, './initializers')
  return fs.readdirAsync(dir)
    .then(files => files.sort())
    .mapSeries((file) => {
      const { default: initializer } = require(path.join(dir, file))
      initializer(context)
      return null
    })
    .catch(err => console.log(err))
}
