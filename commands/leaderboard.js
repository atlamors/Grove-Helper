const { SlashCommandBuilder } 	= require('@discordjs/builders')
const { MessageEmbed } 			= require('discord.js')
const { Display } 				= require('../core/deploy-functions.js')

module.exports = {
	data: 
	new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the deposit leaderboard')
		.addStringOption(option =>
			option.setName('timeperiod')
				.setDescription('The leaderboard time period')
				.setRequired(true)
				.addChoice('Current', 'current')
				.addChoice('All-time', 'alltime')
		),
	async execute(interaction, client) {
		await interaction.reply('Generating ...')
		const display 		= new Display()
		const guild 		= interaction.guild
		const timeperiod	= interaction.options.getString('timeperiod')
		const dates			= display.getMongoTimePeriod(timeperiod)
		const title			= display.getLeaderboardTitle(timeperiod)
		const leaderboard 	= await display.leaderboard(guild, client, dates)

		const leaderboardEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setTitle(`${title} Top 20 leaderboard.`)
			.setThumbnail('https://atlamors.gg/public/nw-trbd.png')
			.setFooter('Grove Company Trust', 'https://atlamors.gg/public/g__new_world_gold.png')
			.addField('\u200b', `**Rank ${display.spaces(3)} Member**`)
			.addField('\u200b', display.constructStrings(leaderboard))
			.addField('\u200b', '\u200b')
			.setTimestamp()

		await interaction.channel.send({ embeds: [leaderboardEmbed] }).then( embedMessage => {
			interaction.deleteReply()
		})
	},
}
