import { forIn } from 'lodash'

const Routes = {}
Routes.get = (route, controller) => {
  route.get('/user', controller.getUserList)
}
Routes.post = (route, controller) => {
  route.post('/user', controller.createUser)
  route.post('/user/login', controller.loginUser)
}
Routes.put = (route, controller) => {
  route.put('/user', controller.updateUser)
}
Routes.del = () => {

}
module.exports = ({ server, controllers }, name) => {
  forIn(Routes, (method) => {
    method(server, controllers[name])
  })
}
