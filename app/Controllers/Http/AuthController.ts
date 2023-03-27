import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'


export default class AuthController {
  public async store({ request, auth }: HttpContextContract) {
    const { password, entity } = request.all()
    const token = await auth.use('api').attempt(entity, password, {
      expiresIn: '30 days',
    })

    return token
  }

  public async destroy({ auth }: HttpContextContract) {
    const user = await auth.authenticate()

    await Mail.sendLater((message) => {
      message
        .from('christianmoraissilvacms@gmail.com')
        .to(user.email)
        .subject('Recuperação de e-mail')
        .htmlView('emails/recover', {
          user,
          url: Env.get('URL_RECOVER')
        })
    })
    // await auth.use('api').logout()
  }
}
