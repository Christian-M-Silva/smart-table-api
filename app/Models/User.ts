import { DateTime } from 'luxon'
import CamelCaseNamingStrategy from './CamelCaseNamingStrategy'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

/**
		* @swagger
		* components:
			* schemas:
			*      User:
			*        type: object
			*        properties:
			*          id:
			*            type: number
			*          quantityLastRow:
			*            type: number
			*          tableId:
			*            type: string
			*          entity:
			*            type: string
			*          email:
			*            type: string
			*          createdAt:
			*            type: DataTime
			*          updatedAt:
			*            type: DataTime
			* 
		*/
export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public quantityLastRow: number

  @column()
  public tableId: string

  @column()
  public entity: string

  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
