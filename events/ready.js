const { ver } = require('../config.json')
const { CRUD } = require('../core/deploy-mongo.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
		const crud = new CRUD()
        global.__clientID = client.user.id

        client.user.setPresence({
            status: 'online',
			activities: [{ name: `New World`, type: 'PLAYING', url: 'https://www.getmysupply.co/' }],
            // activities: [{ name: `${ver}`, type: 'LISTENING', url: 'https://www.getmysupply.co/' }],
        })

        const guilds = client.guilds.cache.map ( guild => {
            const guilds = { "id" : guild.id, "name" : guild.name }
            return guilds
        })

        console.log(`Ready! ${client.user.tag}v${ver} logged into: `)
        guilds.forEach ( guild => {
            console.log (` - ${guild.name}`)
        })

		crud.listdb()

    },
}
