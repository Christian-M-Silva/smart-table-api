import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import CamelCaseNamingStrategy from './CamelCaseNamingStrategy'
import { lastRows } from '../../interfaces/interfaces'

export default class Table extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public idTable: string

  @column()
  public eventId: string

  @column()
  public lastRows: lastRows

  @column()
  public rows: Array<object>

  @column()
  public cols: Array<object>

  @column()
  public daysWeek: Array<object>

  @column()
  public nameTable: string

  @column.dateTime({
    serialize: (value: DateTime) => {
      if (typeof value === 'string') {
        value = DateTime.fromISO(value)
      }
      return value.toFormat('dd/MM/yyyy')
    }
  })
  public nextUpdate: DateTime

  @column.dateTime({
    autoCreate: true, serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    }
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
