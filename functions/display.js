const date = require('date-and-time');
const { CRUD } = require('../core/deploy-mongo.js')


class Display {
	
	async leaderboard(user, guild) {
		const crud = new CRUD()

		guild = `${guild.id}.history`
		user = {
			userId : { $eq : user.id }
		}

		const data = await crud.readMany(user, guild)
		console.log(data)
	}

}

module.exports = Display