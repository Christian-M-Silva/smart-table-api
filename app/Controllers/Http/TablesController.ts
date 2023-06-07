import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Table from 'App/Models/Table'
import Database from '@ioc:Adonis/Lucid/Database'
import { camelCase } from 'lodash'
import { format } from 'date-fns';
export default class TablesController {
  public async index({ params, request, response }: HttpContextContract) {
    const { tableId } = params
    const { page, perPage, search } = request.all()

    const offset = (parseInt(page) - 1) * perPage

    const query = `SELECT * FROM tables WHERE id_table = :idTable AND LOWER(REGEXP_REPLACE(name_table, '[^a-zA-Z0-9]+', '')) LIKE LOWER(CONCAT('%', REGEXP_REPLACE(:search, '[^a-zA-Z0-9]+', ''), '%')) LIMIT :perPage OFFSET :offset`
    const result = await Database.rawQuery(query, {
      idTable: tableId,
      search: search,
      perPage: parseInt(perPage),
      offset: offset
    })

    const countQuery = `SELECT COUNT(*) AS total FROM tables WHERE id_table = :idTable AND LOWER(REGEXP_REPLACE(name_table, '[^a-zA-Z0-9]+', '')) LIKE LOWER(CONCAT('%', REGEXP_REPLACE(:search, '[^a-zA-Z0-9]+', ''), '%'))`
    const countResult = await Database.rawQuery(countQuery, {
      idTable: tableId,
      search: search
    });

    const totalRows = countResult[0][0].total;


    const data = result[0].map((row) => {
      const convertedRow = {}
      for (const key in row) {
        switch (key) {
          case 'next_update':
          case 'created_at':
            const date = new Date(row[key]);
            const dateFormatted = format(date, 'dd/MM/yyyy');
            row[key] = dateFormatted
            break;
        }
        convertedRow[camelCase(key)] = row[key]
      }
      return convertedRow
    })

    response.ok({
      data,
      meta: {
        page: page,
        perPage: perPage,
        total: totalRows
      }
    })
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
    const table = await Table.query().where('idTable', tableId).where('id', id).first()
    table?.delete()
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
