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
	async insertMember(user, guild, deposit) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
			"name" : user.tag,
			"deposit" : deposit,
			"total" : deposit,
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
	 * @returns 
	 */
	async confirmMember(user, guild) {
		const crud = new CRUD()

		guild = guild.id
		user = {
			"_id" : user.id,
		}

		return await ( crud.check(user, guild) ) ? true : false
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @returns 
	 */
	async checkPermissions(user, guild) {
		return await guild.members.fetch(user.id).then( member => {
			return ( member.roles.cache.has('883400308447916053') ) ? true : false
		})
	}


	/**
	 * 
	 * @param {*} message 
	 * @param {*} reactions 
	 */
	createReactions(message, reactions) {
		reactions.forEach( e => { 
			message.react(e)
		});
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guildMembers 
	 * @param {*} reaction 
	 * @param {*} embedMessage 
	 */
	updateConfirmationReaction(user, reaction, embedMessage, reactions) {
		reactions.forEach( e => { 
			if ( reaction.emoji.name !== e ) {
				embedMessage.reactions.cache.get(e).remove()
			}
		});
		reaction.users.remove(user.id)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} data 
	 */
	async updateMemberTotals(user, guild, deposit) {
		const data = await this.readMember(user, guild)

		data["deposit"] = deposit
		data["total"] = data.total + deposit

		this.updateMember(user, guild, data)
	}

	async collector(collector, interaction, _user, reaction, embedMessage, reactions) {
		const guild 	= interaction.guild 		//Guild command was issued in
		const user		= interaction.member.user 	//User who initially issued commands
		const deposit 	= interaction.options.getInteger('deposit')

		if ( await this.checkPermissions(_user, guild) ) {
			console.log(`Approved! ${_user.tag} has permissions.`)
			collector.stop()
			this.updateConfirmationReaction(_user, reaction, embedMessage, reactions)
			this.confirmMember(user, guild).then( r => {
				(r) ? this.updateMemberTotals(user, guild, deposit) : this.insertMember(user, guild, deposit)
			})	
		} else {
			console.log(`${_user.tag} does not have permissions.`)
				reaction.users.remove(_user.id)
		}
	}
}

module.exports = Deposit