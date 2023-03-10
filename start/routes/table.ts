import Route from '@ioc:Adonis/Core/Route'

Route.resource('/table', 'TablesController').apiOnly()