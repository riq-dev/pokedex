require('../index')
const Discord = require('discord.js');
const client = require('../index');

client.on("ready", async () => {
    console.log(`[✅] Conectado: ${client.user.username} `);
});