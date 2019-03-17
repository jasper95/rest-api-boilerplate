const routes = {
  get: [
    {
      url: '/user',
      handler: 'getUserList'
    }
  ],
  post: [
    {
      url: '/user',
      handler: 'createUser'
    },
    {
      url: '/user/login',
      handler: 'loginUser'
    }
  ],
  put: [
    {
      url: '/user',
      handler: 'updateUser'
    }
  ],
  del: []
}
export default routes
