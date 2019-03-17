import crypto from 'crypto'
import fs from 'fs'
import bluebird from 'bluebird'

export const generateSalt = (length = 16) => crypto
  .randomBytes(Math.ceil(length / 2))
  .toString('hex')
  .slice(0, length)

export const generateHash = (password, salt) => crypto
  .createHmac('sha512', salt)
  .update(password)
  .digest('hex')

export const createProxy = (object, cb) => {
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

export const readDirPromise = bluebird.promisify(fs.readdir)


export const serviceLocator = {
  services: {},
  registerService(service_name, service) {
    if (!this.services[service_name]) {
      this.services[service_name] = service
    }
  },
  get(service_name) {
    return this.services[service_name]
  }
}
