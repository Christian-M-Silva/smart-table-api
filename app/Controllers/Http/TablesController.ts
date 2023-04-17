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

  public async destroy({ }: HttpContextContract) { }
}
