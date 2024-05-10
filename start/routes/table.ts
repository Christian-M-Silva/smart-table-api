import Route from '@ioc:Adonis/Core/Route'

Route.group(()=> {
    Route.get('/index/:tableId', 'TablesController.index' )
    Route.post('/', 'TablesController.store' ).middleware('auth')
    Route.put('/updateDates/:id', 'TablesController.updateDates' ).middleware('auth')
    Route.put('/:id', 'TablesController.update' ).middleware('auth')
    Route.post('/existTableWithThisName', 'TablesController.existTableWithThisName' )
    Route.delete('/:tableId/:id/:eventId', 'TablesController.destroy' ).middleware('auth')
}).prefix('/table')

Route.resource('/table', 'TablesController').apiOnly().except(['index', 'destroy', 'store', 'update'])