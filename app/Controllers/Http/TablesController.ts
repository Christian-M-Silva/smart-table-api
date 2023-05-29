import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Table from 'App/Models/Table'

export default class TablesController {
  public async index({ params }: HttpContextContract) {
    const { tableId } = params
    const tables = await Table.query().where('idTable', tableId)
    return tables
  }

  public async store({ request, response }: HttpContextContract) {
    const dataTable = request.all()
    await Table.create(dataTable)
    return response.created()
  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ params }: HttpContextContract) {
    const { tableId, id } = params
    console.log("🚀 ~ file: TablesController.ts:19 ~ TablesController ~ destroy ~ id:", id)
    console.log("🚀 ~ file: TablesController.ts:19 ~ TablesController ~ destroy ~ tableId:", tableId)
  }

  public async search({ params }: HttpContextContract) {
    const { tableId, search } = params
    console.log("🚀 ~ file: TablesController.ts:21 ~ TablesController ~ search ~ search:", search)
    console.log("🚀 ~ file: TablesController.ts:21 ~ TablesController ~ search ~ tableId:", tableId)
  }

  public async download({ params }: HttpContextContract) {
    const { tableId, id } = params
    console.log("🚀 ~ file: TablesController.ts:19 ~ TablesController ~ destroy ~ id:", id)
    console.log("🚀 ~ file: TablesController.ts:19 ~ TablesController ~ destroy ~ tableId:", tableId)
  }

  public async existTableWithThisName({ params }: HttpContextContract) {
    const { tableName, tableId } = params
    
    const existTable = await Table.query().where('idTable', tableId).where('nameTable', tableName)

   if (existTable.length > 0) {
    return true
   }

   return false
  }
}
