const { SlashCommandBuilder } = require('@discordjs/builders')
const { Deposit } = require('../core/deploy-functions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insertmember')
		.setDescription('Insert member is in bank.guild.db'),
	async execute(interaction) {
		const deposit = new Deposit()
		const guild = interaction.guild
		const user = interaction.member.user

		deposit.insertMember(user, guild) 
	},
}
