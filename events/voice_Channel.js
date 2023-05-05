require('../index')
const Discord = require('discord.js')
const client = require('../index')
const { joinVoiceChannel } = require('@discordjs/voice');

client.on("ready", () => {
    let canal = client.channels.cache.get("1102087074242371624")
    if (!canal) return console.log("[❌] Não foi possível entrar no canal de voz.")
    if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`[❌] Não foi possível entrar no canal [ ${canal.name} ].`)

    try {
        joinVoiceChannel({
            channelId: canal.id,
            guildId: canal.guild.id,
            adapterCreator: canal.guild.voiceAdapterCreator,
        })
        console.log(`[✅] Entrei no canal de voz [ ${canal.name} ] com sucesso!`)

    } catch (e) {
        console.log(`[❌] Não foi possível entrar no canal [ ${canal.name} ].`)
    }

})