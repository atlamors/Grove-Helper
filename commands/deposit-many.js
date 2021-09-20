const { SlashCommandBuilder } 	= require('@discordjs/builders')
const { Deposit } 				= require('../core/deploy-functions.js')
const { MessageEmbed } 			= require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('depositmany')
		.setDescription('Rapid fire deposit testing.')
		.addIntegerOption( option => option
			.setName('deposit')
			.setDescription('Enter your exact deposit amount')
			.setRequired(true)
		),
	async execute(interaction) {
		const deposit 	= new Deposit()
		const user 		= interaction.member.user
		const deposit$ 	= interaction.options.getInteger('deposit')

		const exampleEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setDescription(`<@${user.id}> made a **${deposit$} gold** deposit.`)
			.setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png')

		await interaction.reply({ 
			content: `An officer will verify your deposit as soon as possible.`,
			ephemeral: true,
		})

		await interaction.channel.send({ embeds: [exampleEmbed] }).then( embedMessage => {
			const reactions = ['👍', '❌']
			
			deposit.createReactions(embedMessage, reactions)

			const filter = (reaction, _user) => {
				return 	reactions.includes(reaction.emoji.name) && _user.id !== embedMessage.author.id
			}
			
			const collector = embedMessage.createReactionCollector({ filter })
			
			collector.on('collect', (reaction, _user) => {
				var x = 0;
				var intervalID = setInterval(function () {
					deposit.collectorMany(collector, interaction, _user, reaction, embedMessage, reactions)
					if (++x === 30) {
						clearInterval(intervalID);
					}
				}, 200);
				
			})
		})
	},
}
