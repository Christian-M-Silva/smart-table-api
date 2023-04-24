import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Table from 'App/Models/Table'

export default class TablesController {
  public async index({ params }: HttpContextContract) {
    const { tableId } = params
    const tables = await Table.query().where('tableId', tableId)
    return tables
  }

  public async store({ }: HttpContextContract) { }

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
}
