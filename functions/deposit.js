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
	 * @param {*} guild 
	 */
	async checkPermissions(user, guild) {
		const perms = await guild.members.fetch(user.id).then( member => {
			const roles = member.roles.cache.has('883400308447916053')
			if ( roles == true ) {
				return true
			} else {
				return false
			}
		})
		return perms
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
	async updateMemberTotals(user, guild, deposit$) {
		const member = await this.readMember(user, guild)

		if (!member) this.insertMember(user, guild)

		console.log(member)		

		//this.updateMember(user, guild, data)
		
		// guild = guild.id
		// user = {
		// 	"_id" : user.id,
		// }

	}

	async collector(collector, interaction, _user, reaction, embedMessage, reactions) {
		const guild 	= interaction.guild 		//Guild command was issued in
		const user		= interaction.member.user 	//User who initially issued commands
		const deposit$ 	= interaction.options.getInteger('deposit')
		const perms 	= await this.checkPermissions(_user, guild);
		if ( perms == true ) {
			console.log(`Approved! ${_user.tag} has permissions.`)
			collector.stop()
			this.updateConfirmationReaction(_user, reaction, embedMessage, reactions)
			this.updateMemberTotals(user, guild, deposit$)
		} else {
			console.log(`${_user.tag} does not have permissions.`)
			reaction.users.remove(_user.id)
		}
	}
}

module.exports = Deposit