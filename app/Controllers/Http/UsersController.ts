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

  public async destroy({ params }: HttpContextContract) {
    try {
      const user = await User.findByOrFail("email", params.email);
      await user.delete()
    } catch (error) {
      throw error
    }
  }
}
