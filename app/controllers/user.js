import jwt from 'jsonwebtoken'
import {
  generateHash,
  generateSalt
} from '../utils/hash'

export default class UserController {
  async getUserList() {
    return DB.filter('tbl_User')
  }

  async createUser({ params }) {
    const user = await DB.insert('tbl_User', params)
    const salt = generateSalt()
    DB.insert('tbl_UserAuth',
      { user_id: user.id, password: generateHash(params.password, salt), salt })
    return user
  }

  async loginUser({ params }) {
    const { username, password } = params
    const [user] = await DB.filter('tbl_User', { username })
    const { id } = user
    const [{ salt, password: hash_password }] = await DB.filter('tbl_UserAuth', { user_id: id })
    console.log('@@password, salt', password, salt)
    const hash = generateHash(password, salt)
    if (hash !== hash_password) {
      throw { success: false, message: 'Incorrect Password' }
    }
    const token = jwt.sign({ id }, process.env.AUTH_SECRET, {
      expiresIn: process.env.AUTH_VALIDITY
    })
    return {
      ...user,
      token,
      authenticated: true
    }
  }

  async updateUser({ params }) {
    return DB.updateById('tbl_User', params)
  }

  async deleteUser({ params }) {
    return DB.deleteById('tbl_User', params)
  }
}
