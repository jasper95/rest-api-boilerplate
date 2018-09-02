import bluebird from 'bluebird'
import fs from 'fs'

bluebird.promisifyAll(fs)

export default (context) => {
  const routes_path = `${process.cwd()}/app/routes`
  return fs
    .readdirAsync(routes_path)
    .map((file) => {
      if (file && file.includes('.js')) {
        const route = require(`${routes_path}/${file}`) // eslint-disable-line
        route(context, file.split('.')[0])
      }
      return null
    })
}
