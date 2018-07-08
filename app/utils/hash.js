import crypto from 'crypto'

export const generateSalt = (length = 16) => crypto
  .randomBytes(Math.ceil(length / 2))
  .toString('hex')
  .slice(0, length)

export const generateHash = (password, salt) => crypto
  .createHmac('sha512', salt)
  .update(password)
  .digest('hex')
