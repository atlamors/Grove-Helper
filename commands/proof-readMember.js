const { SlashCommandBuilder } = require('@discordjs/builders')
const { Deposit } = require('../core/deploy-functions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('readmember')
		.setDescription('Read member data in bank.guild.db'),
	async execute(interaction) {
		const deposit = new Deposit()
		const guild = interaction.guild
		const user = interaction.member.user
		const r = await deposit.readMember(user, guild)
		if (r) console.log(r)
	},
}
