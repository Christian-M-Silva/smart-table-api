import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthTokenGoogle {
  public async handle({request, response}: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')
    if (!token) {
      return response.status(401)
    }
    await next()
  }
}
