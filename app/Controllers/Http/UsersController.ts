import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid';
import User from 'App/Models/User';
import { DataRegister } from 'interfaces/interfaces';
import RegisterValidator from 'App/Validators/User/RegisterValidator';

export default class UsersController {
  public async store({request}: HttpContextContract) {
    let dataRegister : DataRegister
    dataRegister = await request.validate(RegisterValidator)
    dataRegister.tableId = uuidv4();
    const registerUser = User.create(dataRegister)
    return registerUser
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
