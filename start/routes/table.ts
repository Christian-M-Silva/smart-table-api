import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.get('/:tableId', 'TablesController.index' )
    Route.get('/search/:tableId/:search', 'TablesController.search' )
    Route.get('/download/:tableId/:id', 'TablesController.download' )
    Route.get('/existTableWithThisName/:tableName/:tableId', 'TablesController.existTableWithThisName' )
    Route.delete('/:tableId/:id', 'TablesController.destroy' )
}).prefix('/table')

Route.resource('/table', 'TablesController').apiOnly().except(['index', 'destroy'])