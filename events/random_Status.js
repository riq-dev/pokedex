require('../index')
const Discord = require('discord.js')
const client = require('../index')

client.on('ready', () => {
    client.user.setPresence({
        activities: [{ name: `FiveM`, type: Discord.ActivityType.Playing }], status: 'idle',
    });

    setInterval(() => {
        const nameList = ["É A TROPA DO BRASIL.mp3", "SOPA DE MACACO", "OLHA O MASQUEICO"];

        const randomName = nameList[Math.floor(Math.random() * nameList.length)];

        client.user.setPresence({
            activities: [{
                name: randomName,
                type: Discord.ActivityType.Listening,
            }],
            status: 'dnd',
        });
    }, 3000);
})