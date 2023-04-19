import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.get('/:tableId', 'TablesController.index' )
    Route.get('/search/:tableId/:search', 'TablesController.search' )
}).prefix('/table')

Route.resource('/table', 'TablesController').apiOnly().except(['index'])