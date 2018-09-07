import corsMiddleware from 'restify-cors-middleware'

export default corsMiddleware({
  preflightMaxAge: 1000,
  origins: ['*'],
  allowHeaders: ['Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Token, Authorization'],
  exposeHeaders: ['X-Api-Version, X-Request-Id, X-Response-Time']
})
