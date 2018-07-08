const Routes = {}
Routes.get = (route, controller) => {
  route.get('/company', controller.getCompanyList)
}
Routes.post = (route, controller) => {
  route.post('/company', controller.createCompany)
}
Routes.put = (route, controller) => {
  route.put('/company', controller.updateCompany)
}
Routes.del = () => {

}
module.exports = ({ server, controllers }, name) => {
  _.forIn(Routes, (method) => {
    method(server, controllers[name])
  })
}
