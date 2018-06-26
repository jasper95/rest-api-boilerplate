'use strict'

export default class SampleController {
	async getCompanyList() {
		return DB.filter('tbl_Company')
	}
	async createCompany({ params }){
		return DB.insert('tbl_Company', params)
	}
	async updateCompany({ params }){
		return DB.updateById('tbl_Company', params)
	}
	async deleteCompany({ params }) {
		return DB.deleteById('tbl_Company', params)
	}
}