import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rows: Array<object>

  @column()
  public columns: Array<object>

  @column()
  public daysWeek: Array<string>

  @column()
  public nameTable: string

  @column.dateTime()
  public nextUpdate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
