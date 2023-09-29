import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('entity', 255).notNullable().unique()
      table.string('table_id', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { precision: 6 }).notNullable()
      table.timestamp('updated_at', { precision: 6 }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
