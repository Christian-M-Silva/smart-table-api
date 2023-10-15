import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid';
import User from 'App/Models/User';
import { DataRegister } from 'interfaces/interfaces';
import RegisterValidator from 'App/Validators/User/RegisterValidator';

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    try {
      let dataRegister: DataRegister
      dataRegister = await request.validate(RegisterValidator)
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

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
