const { SlashCommandBuilder } = require('@discordjs/builders')
const { Deposit } = require('../core/deploy-functions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletemember')
		.setDescription('Delete member is in bank.guild.db'),
	async execute(interaction) {
		const deposit = new Deposit()
		const guild = interaction.guild
		const user = interaction.member.user
		
		deposit.deleteMember(user, guild)
	},
}
