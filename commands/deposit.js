const { SlashCommandBuilder } 	= require('@discordjs/builders')
const { Deposit } 				= require('../core/deploy-functions.js')
const { MessageEmbed } 			= require('discord.js')

module.exports = {
	data: 
	new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Submit deposit request for the guild bank.')
		.addIntegerOption( option => option
			.setName('deposit')
			.setDescription('Enter your exact deposit amount')
			.setRequired(true)
		),
	async execute(interaction) {
		const deposit 	= new Deposit()
		const user 		= interaction.member.user
		const deposit$ 	= interaction.options.getInteger('deposit')

		const depositEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setDescription(`<@${user.id}> made a **${deposit$} gold** deposit.`)
			.setFooter('Grove Company Trust', 'https://atlamors.gg/public/g__new_world_gold.png')
			.setTimestamp()

		await interaction.reply({ 
			content: `An officer will verify your deposit as soon as possible.`,
			ephemeral: true,
		})

		await interaction.channel.send({ embeds: [depositEmbed] }).then( embedMessage => {
			const reactions = ['👍', '❌']
			
			deposit.createReactions(embedMessage, reactions)

			const filter = (reaction, _user) => {
				return reactions.includes(reaction.emoji.name) && _user.id !== embedMessage.author.id
			}
			
			const collector = embedMessage.createReactionCollector({ filter })
			
			collector.on('collect', (reaction, _user) => {
				const obj = {
					"collector" 	: collector,
					"interaction" 	: interaction,
					"_user" 		: _user,
					"reaction" 		: reaction,
					"embedMessage" 	: embedMessage,
					"reactions" 	: reactions,
				}
				const options = {
					"upsert" 	: true,
					"operator" 	: "$inc"
				}
				deposit.collector(obj, options)
			})
		})
	},
}
