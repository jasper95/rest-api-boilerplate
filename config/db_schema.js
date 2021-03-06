module.exports = {
  tables: [
    {
      table_name: 'tbl_Company',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          unique: true,
          required: true
        },
        {
          column_name: 'legal_name',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'tbl_User',
      columns: [
        {
          column_name: 'username',
          type: 'string',
          required: true,
          index: true
        },
        {
          column_name: 'company_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'tbl_Company',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        }
      ]
    },
    {
      table_name: 'tbl_UserAuth',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'tbl_User',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'password',
          type: 'string',
          default: '',
          required: true
        },
        {
          column_name: 'salt',
          type: 'string',
          required: true
        }
      ]
    }
  ]
}
