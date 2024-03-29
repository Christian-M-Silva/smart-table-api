import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.get('/index/:tableId', 'TablesController.index' )
    Route.get('/search/:tableId/:search', 'TablesController.search' )
    Route.get('/download/:tableId/:id', 'TablesController.download' )
    Route.put('/updateDates/:id', 'TablesController.updateDates' )
    Route.post('/existTableWithThisName', 'TablesController.existTableWithThisName' )
    Route.delete('/:tableId/:id/:eventId', 'TablesController.destroy' )
}).prefix('/table')

Route.resource('/table', 'TablesController').apiOnly().except(['index', 'destroy'])