const { ver } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        global.__clientID = client.user.id;

        client.user.setPresence({
            status: 'online',
            activities: [{ name: `${ver}`, type: 'LISTENING', url: 'https://www.getmysupply.co/' }],
        });

        const guilds = client.guilds.cache.map ( guild => {
            const guilds = { "id" : guild.id, "name" : guild.name };
            return guilds;
        });

        console.log(`Ready! ${client.user.tag}v${ver} logged into: `);
        guilds.forEach ( guild => {
            console.log (` - ${guild.name}`);
        });

    },
};
