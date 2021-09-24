const { CRUD } 	= require('../core/deploy-mongo.js')
const date		= require('date-and-time')

class Display {
	
	/**
	 * 
	 * @param {*} guild 
	 * @param {*} client 
	 * @param {*} dates 
	 * @returns 
	 */
	async leaderboard(guild, client, dates) {
		const crud 			= new CRUD()
		const guildHistory 	= `${guild.id}.history`
		const allMembers 	= await crud.readAll(guild.id)
		let   leaderboard	= []

		for ( const member of allMembers ) {

			const getMember = { userId : { $eq : member._id }	}
			const data 		= await crud.readMany(getMember, guildHistory, dates)
			const _user 	= await client.users.fetch(member._id)
			let   total 	= 0

			for ( const o of data ) {
				total += o.deposit
			}

			leaderboard.push({ member: _user.username, total: total })
			
		}

		return leaderboard.sort((a, b) => b.total - a.total )
	}

	/**
	 * 
	 * @param {*} timePeriod 
	 * @returns 
	 */
	getMongoTimePeriod(timePeriod) {
		const _date 	= new Date()
		let   startDate
		let   endDate
		
		switch(timePeriod) {
			case 'current':
				startDate 	= new Date()
				endDate 	= new Date(_date.getFullYear(), _date.getMonth())
				break;
			case 'alltime':
				startDate 	= new Date()
				endDate 	= new Date(1970)
				break;
		}

		return { $gte: endDate, $lt: startDate }
	}

	/**
	 * 
	 * @param {*} timePeriod 
	 * @returns 
	 */
	getLeaderboardTitle(timePeriod) {
		let   title
		
		switch(timePeriod) {
			case 'current':
				title = `${date.format( new Date(), 'MMMM')}'s`
				break;
			case 'alltime':
				title = "All-time"
				break;
		}
		
		return title
	}

	constructStrings(leaderboard) {
		let maxStr	= 12
		let line  	= ""
		let i 		= 1

		for ( const o of leaderboard ) {
			const rank = `${i}`
			if ( i === 1 ) {
				line += `👑${this.spaces(7)}`
			} else {
				line += `#${rank}${this.spaces(8 - rank.length)}`
			}
			line += `**${this.name(o.member, maxStr)}** with **${o.total}** gold\n`
			i++
		}

		return line
	}

	spaces(amount) {
		let spaces = ""
		for (let i = 0; i < amount; i++) {
			spaces += "\u2004"
		}
		return spaces
	}

	name(str, n) {
		return (str.length > n) ? str.substr(0, n-1) + '...' : str
	}

}

module.exports = Display