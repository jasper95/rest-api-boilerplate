import bluebird from 'bluebird'
import fs from 'fs'
import path from 'path'
import util from 'util'

bluebird.promisifyAll(fs)

export default async ({ server, log }) => {
  const context = { server, log }
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
