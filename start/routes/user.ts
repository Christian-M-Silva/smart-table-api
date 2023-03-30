import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.put('/sendEmailForgetPassword', 'UsersController.sendEmailForgetPassword' )
}).prefix('/user')
Route.resource('/user', 'UsersController').apiOnly().except(['index'])