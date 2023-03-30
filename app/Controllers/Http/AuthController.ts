import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class AuthController {
  public async store({ request, auth }: HttpContextContract) {
    const { password, entity } = request.all()
    const token = await auth.use('api').attempt(entity, password, {
      expiresIn: '30 days',
    })

    return token
  }

  public async destroy({ auth }: HttpContextContract) {

    await auth.use('api').logout()
  }
}
