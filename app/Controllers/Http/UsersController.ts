import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid';
import User from 'App/Models/User';
import Database from '@ioc:Adonis/Lucid/Database';
import { DataRegister } from 'interfaces/interfaces';
import RegisterValidator from 'App/Validators/User/RegisterValidator';
import GoogleCalendarApi from 'App/ExternalService/GoogleApi/GoogleCalendarApi';


export default class UsersController {
  private googleCalendarApi: GoogleCalendarApi;

  constructor() {
    this.googleCalendarApi = new GoogleCalendarApi();
  }

  public async store({ request }: HttpContextContract) {
    try {
      let dataRegister: DataRegister
      dataRegister = await request.validate(RegisterValidator)
      dataRegister.quantityLastRow = 2
      dataRegister.tableId = uuidv4();
      const user = User.create(dataRegister)
      return user
    } catch (error) {
      throw error
    }
  }

  public async isEmailRegister({ params }: HttpContextContract) {
    try {
      const { email } = params
      const user = await User.findBy('email', email)
      return user
    } catch (error) {
      throw error
    }
  }

  public async update({ request, params }: HttpContextContract) {
    try {
      const userUpdate = request.all()
      const { email } = params;
      const user = await User.findByOrFail("email", email);
      await user.merge(userUpdate).save()
      return user
    } catch (error) {
      throw error
    }
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    try {
      const token = request.header('Authorization')
      if (!token) {
        return response.status(401)
      }
      const user = await User.findByOrFail("email", params.email);
      const querySelect = `SELECT * FROM tables WHERE id_table="${user.tableId}"`
      const tables = await Database.rawQuery(querySelect)
      for (const el of tables[0]) {
        await this.googleCalendarApi.deleteEvent(el.event_id, token)
      }
      const queryDelete = `DELETE FROM tables WHERE id_table="${user.tableId}"`
      await Database.rawQuery(queryDelete)
      await user.delete()
    } catch (error) {
      throw error
    }
  }
}
