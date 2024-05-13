import Route from '@ioc:Adonis/Core/Route'
Route.get('/user/isEmailRegister/:email', 'UsersController.isEmailRegister')
Route.put('/user/:email', 'UsersController.update')
Route.delete('/user/:email', 'UsersController.destroy').middleware('auth')
Route.resource('/user', 'UsersController').apiOnly().except(['index', 'update', 'destroy', 'show'])