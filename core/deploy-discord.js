const fs = require('fs')
const { token } = require( __root + '/config.json')
const { Client, Collection, Intents } = require('discord.js')

const intents = new Intents().add( Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS )
const client = new Client({ intents: intents })

client.commands = new Collection()


const commandFiles = fs.readdirSync( __root + '/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require( __root +`/commands/${file}`)
	client.commands.set(command.data.name, command)
}


const eventFiles = fs.readdirSync( __root + '/events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const event = require( __root + `/events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}


client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return

	const command = client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
	}
})

client.login(token)
