const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, token } = require( __root + '/config.json')

const commands = []
const commandFiles = fs.readdirSync( __root + '/commands').filter(file => file.endsWith('.js'))

console.log("Loading bot commands:")
for (const file of commandFiles) {
	console.log(` - ${file}`)
	const command = require( __root + `/commands/${file}`)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(token);

( async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		)

		console.log('Successfully registered bot commands!')
	} catch (error) {
		console.error(error)
	}
})()
