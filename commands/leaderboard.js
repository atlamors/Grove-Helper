const { SlashCommandBuilder } 	= require('@discordjs/builders')
const { Display } 				= require('../core/deploy-functions.js')
const { MessageEmbed } 			= require('discord.js')
const date 						= require('date-and-time');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the deposit leaderboard for this month'),
	async execute(interaction) {
		await interaction.reply('Generating ...')
		const display = new Display()
		const user 		= interaction.member.user
		const guild 	= interaction.guild

		const leaderboard = display.leaderboard(user, guild)

		const exampleEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setDescription(`${date.format( new Date(), 'MMMM')}'s leaderboard.`)
			.addFields(
				{ name: `Rank`, value: `1\n2\n3\n4\n1\n2\n3\n4\n`, inline: true },
				{ name: `User`, value: `{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n{user.name}\n`, inline: true },
				{ name: `Balance`, value: '{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n{user.totalMonth}\n', inline: true },
			)
			.setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png')

		await interaction.channel.send({ embeds: [exampleEmbed] }).then( embedMessage => {
		})
	},
}
