import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Table from 'App/Models/Table'
import User from 'App/Models/User';
import Database from '@ioc:Adonis/Lucid/Database'
import { camelCase } from 'lodash'
import { TypeGetTable } from 'interfaces/interfaces'
import { format } from 'date-fns';
import GoogleCalendarApi from 'app/ExternalService/GoogleApi/GoogleCalendarApi';
export default class TablesController {
  private googleCalendarApi: GoogleCalendarApi;

  constructor() {
    this.googleCalendarApi = new GoogleCalendarApi();
  }
  public async index({ params, request, response }: HttpContextContract) {
    try {
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


      const data = result[0].map((row: TypeGetTable) => {
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
    } catch (error) {
      throw error;
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const dataTable = request.all()
    const token = request.header
    const eventId = await this.googleCalendarApi.createEvent(dataTable, token)
    dataTable.eventId = eventId
    await Table.create(dataTable)
    response.created()
  }

  public async updateDates({ request, response, params }: HttpContextContract) {
    try {
      const dataTable = request.all()
      const token = request.header
      const table = await Table.findOrFail(params.id)
      table.merge(dataTable)
      const tableUpdate = await table.save()
      const user = await User.findByOrFail('tableId', tableUpdate.idTable)
      const newEventId = await this.googleCalendarApi.updateEvent(dataTable, user.email, tableUpdate.eventId, tableUpdate.nameTable, token)
      if (newEventId) {
        dataTable.eventId = newEventId
        table.merge(dataTable)
        await table.save()
      }
      response.created(tableUpdate.nameTable)
    } catch (error) {
      throw error
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const { id } = params
    const table = await Table.findOrFail(id)
    response.ok(table)
  }

  public async update({ request, params }: HttpContextContract) {
    try {
      const table = await Table.findOrFail(params.id)
      if (!table) return null
      const token = request.header
      const tableOldUpdateDay = table.nextUpdate
      const data = request.all()

      table.merge(data)
      const tableUpdate = await table.save()

      if (table.nextUpdate !== tableOldUpdateDay) {
        const user = await User.findByOrFail('tableId', tableUpdate.idTable)
        const newEventId = await this.googleCalendarApi.updateEvent(data, user.email, tableUpdate.eventId, tableUpdate.nameTable, token)
        if (newEventId) {
          data.eventId = newEventId
          table.merge(data)
          await table.save()
        }
      }
      return table
    } catch (err) {
      throw new Error(err);
    }
  }

  public async destroy({ request, params }: HttpContextContract) {
    const { tableId, id, eventId } = params
    const token = request.header
    await this.googleCalendarApi.deleteEvent(eventId, token)
    const table = await Table.query().where('idTable', tableId).where('id', id).first()
    table?.delete()
  }

  public async download({ params }: HttpContextContract) {
    const { tableId, id } = params
    const table = await Table.query().where('idTable', tableId).where('id', id).first()
    return table
  }

  public async existTableWithThisName({ request }: HttpContextContract) {
    const { tableName, tableId } = request.all()

    const existTable = await Table.query().where('idTable', tableId).where('nameTable', tableName)

    if (existTable.length > 0) {
      return true
    }

    return false
  }
}
