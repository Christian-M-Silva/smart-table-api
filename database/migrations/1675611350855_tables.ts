import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tables'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name_table').notNullable()
      table.text('rows', 'longtext').notNullable()
      table.text('cols', 'longtext').notNullable()
      table.dateTime('next_update', { precision: 6 }).notNullable()
      table.text('days_week', 'longtext').notNullable()
      table.integer('id_table').notNullable().unique()


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { precision: 6 })
      table.timestamp('updated_at', { precision: 6 })
    })
  }
gr
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
