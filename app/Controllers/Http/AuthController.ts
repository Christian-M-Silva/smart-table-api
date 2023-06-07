import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class AuthController {
  public async store({ request, auth }: HttpContextContract) {
    const { password, entity } = request.all()
    const dataToken = await auth.use('api').attempt(entity, password, {
      expiresIn: '30 days',
    })

    const tableId = dataToken.user.tableId
    return { dataToken, tableId }
  }

  public async destroy({ auth }: HttpContextContract) {

    await auth.use('api').logout()
  }

  public async isAuthenticate({ auth }: HttpContextContract) {
    let entity = ''
    const isAuthenticate = await auth.check()
    if (isAuthenticate) {
      const user = await auth.authenticate()
       entity = user.entity
    }

    return {
      entity,
      isAuthenticate
    }
  }
}
