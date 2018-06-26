'use strict'

export default (context) => {
	const routes_path = process.cwd() + '/src/routes'

	return fs
			.readdirAsync(routes_path)
			.map(file => {
				if(file && file.includes('.js'))
				{
					const route = require(`${routes_path}/${file}`)
					route(context, file.split('.')[0])
				}
			})
}