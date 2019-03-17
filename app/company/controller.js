export default class SampleController {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getCompanyList() {
    return this.DB.filter('tbl_Company')
  }

  async createCompany({ params }) {
    return this.DB.insert('tbl_Company', params)
  }

  async updateCompany({ params }) {
    return this.DB.updateById('tbl_Company', params)
  }

  async deleteCompany({ params }) {
    return this.DB.deleteById('tbl_Company', params)
  }
}
