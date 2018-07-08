import jwt from 'jsonwebtoken'

const unprotected_routes = {
  GET: [],
  POST: [
    '/user',
    '/user/login',
    '/company'
  ],
  PUT: [],
  DELETE: []
}

export default (req, res, next) => {
  let authenticated = true
  let auth_error = ''
  if (!unprotected_routes[req.method].includes(req.url)) {
    const token = req.headers['x-access-token']
    if (!token) {
      authenticated = false
      auth_error = 'Access token is required'
    } else {
      try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET)
        req.user_id = decoded.id
      } catch (err) {
        authenticated = false
        auth_error = err
      }
    }
  }
  req.authenticated = authenticated
  req.auth_error = auth_error
  return next()
}
