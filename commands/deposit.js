const { Deposit } = require('../_core/deploy-functions.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageAttachment, MessageEmbed } = require('discord.js');

const intents   = new Intents().add( Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS );
const client    = new Client({ intents: intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });
const deposit   = new Deposit();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Submit deposit for New World company bank.')
		.addIntegerOption( option => option.setName('deposit').setDescription('Enter your exact deposit amount').setRequired(true) ),
	async execute(interaction) {

        const guildMembers    = await interaction.guild.members;
		const interactionUser = interaction.client.user;
		const depositAmount	  = interaction.options.getInteger('deposit');

		const exampleEmbed = new MessageEmbed()
			.setColor('#ffd60a')
			.setDescription(`<@${interactionUser.id}> made a **${deposit} gold** deposit.`)
			.setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

		await interaction.reply({ content: `An officer will verify your deposit as soon as possible.`, ephemeral: true });

		await interaction.channel.send({ embeds: [exampleEmbed] }).then(embedMessage => {
    		embedMessage.react("👍")
			embedMessage.react("❌")

			const filter = (reaction, user) => { return ['👍', '❌'].includes(reaction.emoji.name) && user.id !== embedMessage.author.id	}

			const collector = embedMessage.createReactionCollector({ filter })

			collector.on('collect', (reaction, user) => {
                deposit.confirmReaction(user, guildMembers, reaction, embedMessage)
			});
		});
	},
};
