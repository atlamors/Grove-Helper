const date = require('date-and-time')
const { CRUD } = require('../core/deploy-mongo.js')
const { MessageEmbed } = require('discord.js')

class Deposit {
	
	constructor() {
		this.name = 'Deposit'
		this.date = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss:SSSZ')
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} deposit 
	 */
	async insertMember(user, guild, deposit) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
			"name" : user.tag,
			"date" : new Date(),
			"deposit" : deposit,
			"balance" : deposit,
			"totalMonth" : deposit
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
	 * @param {*} data 
	 */
	async updateMemberTotals(user, guild, deposit) {
		const data = await this.readMember(user, guild)

		data["date"] = new Date()
		data["deposit"] = deposit
		data["balance"] = data.balance + deposit
		data["totalMonth"] = data.totalMonth + deposit

		this.updateMember(user, guild, data)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} data 
	 * @param {*} options 
	 */
	async upsertMember(user, guild, data, options) {
		const crud = new CRUD()
		
		guild = guild.id
		user = {
			"_id" : user.id,
		}

		crud.upsert(user, guild, data, options)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} deposit 
	 * @param {*} options 
	 */
	async upsertMemberTotals(user, guild, deposit, options) {
		const data = {}

		data["balance"] = deposit

		this.upsertMember(user, guild, data, options)
	}

	/**
	 * 
	 * @param {*} user 
	 * @param {*} guild 
	 * @param {*} deposit 
	 */
	async insertTransactionHistory(user, guild, deposit) {
		const crud = new CRUD()
		
		guild = `${guild.id}.history`
		user = {
			"userId" : user.id,
			"date" : new Date(),
			"deposit" : deposit,
		}

		crud.create(user, guild) 
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
			return ( member.roles.cache.has('876290873598574623') ) ? true : false
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
	 * @param {*} obj 
	 * @param {*} options 
	 */
	async collector(obj, options) {
		const collector 	= obj.collector
		const interaction 	= obj.interaction
		const _user 		= obj._user
		const reaction 		= obj.reaction
		const embedMessage 	= obj.embedMessage
		const reactions 	= obj.reactions

		const guild 	= interaction.guild 		//Guild command was issued in
		const user		= interaction.member.user 	//User who initially issued commands
		const deposit 	= interaction.options.getInteger('deposit')

		if ( await this.checkPermissions(_user, guild) ) {
			console.log(`${this.date} | Approved! ${_user.tag} has permissions.`)
			collector.stop()
			this.updateConfirmationReaction(_user, reaction, embedMessage, reactions)
			if ( reaction.emoji.name == '👍') {
				const receivedEmbed = embedMessage.embeds[0];
				const updateEmbed = new MessageEmbed(receivedEmbed).setColor('#06A77D')
				embedMessage.edit({ embeds: [updateEmbed] })
				this.upsertMemberTotals(user, guild, deposit, options)
				this.insertTransactionHistory(user, guild, deposit)
			} else {
				const receivedEmbed = embedMessage.embeds[0];
				const updateEmbed = new MessageEmbed(receivedEmbed).setColor('#BF3100')
				embedMessage.edit({ embeds: [updateEmbed] })
			}
		} else {
			console.log(`${this.date} | ${_user.tag} does not have permissions.`)
			reaction.users.remove(_user.id)
		}
	}
}

module.exports = Deposit