const { SlashCommandBuilder } = require('@discordjs/builders')
const { Deposit } = require('../core/deploy-functions.js')
const { MessageEmbed } = require('discord.js')


const deposit = new Deposit()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Submit deposit request for the guild bank.')
		.addIntegerOption( option => option
			.setName('deposit')
			.setDescription('Enter your exact deposit amount')
			.setRequired(true)
		),
	async execute(interaction) {
		const guild = await interaction.guild.members
		const interactionUser = interaction.member.user
		const depositAmount = interaction.options.getInteger('deposit')

		const exampleEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setDescription(`<@${interactionUser.id}> made a **${depositAmount} gold** deposit.`)
			.setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png')

		await interaction.reply({ content: `An officer will verify your deposit as soon as possible.`, ephemeral: true })

		await interaction.channel.send({ embeds: [exampleEmbed] }).then((embedMessage) => {
			
			embedMessage.react('👍')
			embedMessage.react('❌')

			const filter = (reaction, user) => {
				return ['👍', '❌'].includes(reaction.emoji.name) && user.id !== embedMessage.author.id
			}

			const collector = embedMessage.createReactionCollector({ filter })

			collector.on('collect', (reaction, user) => {
				deposit.confirmReaction(user, guild, reaction, embedMessage)
			})
		})
	},
}
