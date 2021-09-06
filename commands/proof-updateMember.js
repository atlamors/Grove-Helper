const { SlashCommandBuilder } = require('@discordjs/builders')
const { Deposit } = require('../core/deploy-functions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updatemember')
		.setDescription('Update member in bank.guild.db')
		.addIntegerOption( option => option
			.setName('deposit')
			.setDescription('Enter your exact deposit amount')
			.setRequired(true)
		),
	async execute(interaction) {
		const deposit = new Deposit()
		const guild = await interaction.guild
		const user = interaction.member.user
		const data = {
			"latest-deposit" : interaction.options.getInteger('deposit'),
			"current-balance" : null,
			"total" : null,
			"month-total" : null,
		}
		
		deposit.updateMember(user, guild, data)
	},
}
