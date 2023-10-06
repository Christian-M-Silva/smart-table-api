import Route from '@ioc:Adonis/Core/Route'
Route.get('/user/isEmailRegister/:email', 'UsersController.isEmailRegister')
Route.resource('/user', 'UsersController').apiOnly().except(['index'])