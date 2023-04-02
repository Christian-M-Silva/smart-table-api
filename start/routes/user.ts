import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.post('/sendEmailForgetPassword', 'UsersController.sendEmailForgetPassword' )
    Route.put('/changePassword/:tableId', 'UsersController.changePassword' )
}).prefix('/user')
Route.resource('/user', 'UsersController').apiOnly().except(['index'])