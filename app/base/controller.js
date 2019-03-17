export default class SampleController {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getNodeList() {
    return this.DB.filter('tbl_Company')
  }

  async getNodeDetails({ params }) {
    return this.DB.filter('tbl_Company', params)
  }

  async createNode({ params }) {
    return this.DB.insert('tbl_Company', params)
  }

  async updateNode({ params }) {
    return this.DB.updateById('tbl_Company', params)
  }

  async deleteNode({ params }) {
    return this.DB.deleteById('tbl_Company', params)
  }
}
