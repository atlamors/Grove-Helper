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
		let   maxStr		= 12
		let   line			= ""
		let   i 			= 1

		for ( const o of leaderboard ) {
			let rank = `${i}`
			if ( i === 1 ) {
				line += `👑${display.spaces(7)}`
			} else {
				line += `#${rank}${display.spaces(8 - rank.length)}`
			}
			line += `**${display.name(o.member, maxStr)}** with **${o.total}** gold\n`
			i++
		}

		const leaderboardEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setTitle(`${title} leaderboard.`)
			.setThumbnail('https://atlamors.gg/public/nw-trbd.png')
			.setFooter('Grove Company Trust', 'https://atlamors.gg/public/g__new_world_gold.png')
			.addField('\u200b', `**Rank ${display.spaces(3)} Member**`)
			.addField('\u200b', line)
			.addField('\u200b', '\u200b')
			.setTimestamp()

		await interaction.channel.send({ embeds: [leaderboardEmbed] }).then( embedMessage => {
			interaction.deleteReply()
		})
	},
}
