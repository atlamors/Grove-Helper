'use strict'

const { CRUD } = require('../core/deploy-mongo.js')

class Deposit {
	
	constructor() {
		this.name = 'Deposit'
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 */
	async insertMember(user, guild) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
			"name" : user.tag,
		}

		crud.create(user, guild) 
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @returns 
	 */
	async readMember(user, guild) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
		}

		return crud.read(user, guild) 
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} data 
	 */
	async updateMember(user, guild, data) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
		}

		crud.update(user, guild, data)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 */
	async deleteMember(user, guild) {
		const crud = new CRUD()

		guild = guild.id
		user = {
			"_id" : user.id,
		}

		crud.delete(user, guild)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 */
	async checkPerms(user, guild) {
		await guild.fetch(user.id).then( member => {
			if ( member.roles.cache.has('883400308447916053') ) {
				return true
			} else {
				console.log(member.roles.cache)
				return null
			}
		})
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guildMembers 
	 * @param {*} reaction 
	 * @param {*} embedMessage 
	 */
	confirmReaction(user, guild, reaction, embedMessage) {

		if ( this.checkPerms(user, guild) ) {

			console.log(`Approved! ${user.tag} has permissions.`)

			switch (reaction.emoji.name) {
				case '👍':
					embedMessage.reactions.cache.get('❌').remove()
					break
				case '❌':
					embedMessage.reactions.cache.get('👍').remove()
					break
				default:
					console.log(`${reaction.emoji.name} is an invalid response.`)
			}

			reaction.users.remove(user.id)

		} else {
			console.log(`${user.tag} does not have permissions.`)
			reaction.users.remove(user.id)
		}
	}
}

module.exports = Deposit