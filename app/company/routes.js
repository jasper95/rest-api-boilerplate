const routes = {
  get: [
    {
      url: '/company',
      handler: 'getCompanyList'
    }
  ],
  post: [
    {
      url: '/company',
      handler: 'createCompany'
    }
  ],
  put: [
    {
      url: '/company',
      handler: 'updateCompany'
    }
  ],
  del: []
}
export default routes
