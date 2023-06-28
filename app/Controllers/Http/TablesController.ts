import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Table from 'App/Models/Table'
import Database from '@ioc:Adonis/Lucid/Database'
import { camelCase } from 'lodash'
import { format } from 'date-fns';
import Env from '@ioc:Adonis/Core/Env'
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), Env.get('CREDENTIALS_JSON'));
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

    this.authorize()
      .then(res => console.log(res))
      .catch(e => console.error(e));

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

  public async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  public async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  public async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  // public async listEvents(auth) {
  //   const calendar = google.calendar({ version: 'v3', auth });
  //   const res = await calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: new Date().toISOString(),
  //     maxResults: 10,
  //     singleEvents: true,
  //     orderBy: 'startTime',
  //   });
  //   const events = res.data.items;
  //   if (!events || events.length === 0) {
  //     console.log('No upcoming events found.');
  //     return;
  //   }
  //   console.log('Upcoming 10 events:');
  //   events.map((event, i) => {
  //     const start = event.start.dateTime || event.start.date;
  //     console.log(`${start} - ${event.summary}`);
  //   });
  // }

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
