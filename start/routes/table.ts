import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.get('/:tableId', 'TablesController.index' )
}).prefix('/table')
Route.resource('/table', 'TablesController').apiOnly().except(['index'])