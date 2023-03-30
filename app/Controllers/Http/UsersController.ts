import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid';
import User from 'App/Models/User';
import { DataRegister } from 'interfaces/interfaces';
import RegisterValidator from 'App/Validators/User/RegisterValidator';
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    let dataRegister: DataRegister
    dataRegister = await request.validate(RegisterValidator)
    dataRegister.tableId = uuidv4();
    User.create(dataRegister)
    return response.created()
  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }

  public async sendEmailForgetPassword({ request, response }: HttpContextContract) {
    const { email } = request.all()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.notFound({error: 'E-mail não cadastrado'})
    }

    await Mail.sendLater((message) => {
      message
        .from('tininjacms@gmail.com')
        .to(email)
        .subject('Recuperação de e-mail')
        .htmlView('emails/recover', {
          user,
          url: `${Env.get('URL_RECOVER')}/${user.tableId}`
        })
    })

    return response.ok({message: 'Email enviado, veja sua caixa de entrada ou span'})

  }
}
