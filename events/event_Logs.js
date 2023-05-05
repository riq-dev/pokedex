require('../index')
const client = require('../index')
const Discord = require("discord.js")
const logs = require('discord-logs');
logs(client);

// Mensagem editada
client.on("messageUpdate", (message, oldMessage, newMessage) => {
    if (message.author.id === client.user.id) return;
    const channel = client.channels.cache.get("1101214101721595965");
    const embed = new Discord.EmbedBuilder()
        .setTitle(`LOG | Mensagem Editada.`)
        .setColor('Aqua')
        .setThumbnail(oldMessage.author.avatarURL({ size: 2048 }))
        .setTimestamp(new Date())
        .setDescription(`**Autor da mensagem** \n> **Usuário:** ${message.author} \n> **ID:** ${message.author.id} \n\n**Canal:** \n> ${message.channel} \n\n**Mensagem antiga:** \n \`\`\`${message.content}\`\`\` \n**Mensagem nova:** \n \`\`\`${oldMessage.content}\`\`\``);

    channel.send({ embeds: [embed] })
})

// Mensagem apagada
client.on("messageDelete", (message) => {
    if (message.author.id === client.user.id) return;
    const channel = client.channels.cache.get("1101214008951963739");
    const embed = new Discord.EmbedBuilder()
        .setTitle(`LOG | Mensagem Deletada.`)
        .setColor('Aqua')
        .setThumbnail(message.author.avatarURL({ size: 2048 }))
        .setTimestamp(new Date())
        .setDescription(`**Autor da mensagem**  \n> **Usuário:** ${message.author} \n> **ID:** ${message.author.id} \n\n**Canal:** \n> ${message.channel} \n\n**Mensagem deletada:** \n \`\`\`${message.content}\`\`\``)
    channel.send({ embeds: [embed] });
})

// Saída
client.on("guildMemberRemove", (member) => {
    let canal_logs = "1074674525003862016";
    if (!canal_logs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Adeus ${member.user.username}....`)
        .setDescription(`> O usuário ${member} saiu do servidor!\n> 😓 Espero que retorne um dia.\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`);

    member.guild.channels.cache.get(canal_logs).send({ embeds: [embed], content: `${member}` })
})

//Entrada
client.on("guildMemberAdd", (member) => {
    let canal_logs = "1074674523510669342";
    if (!canal_logs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle("👋 Boas Vindas!")
        .setDescription(`> Olá ${member}!\nSeja Bem-Vindo(a) ao servidor \`${member.guild.name}\`!\nAtualmente estamos com \`${member.guild.memberCount}\` membros.`);

    member.guild.channels.cache.get(canal_logs).send({ embeds: [embed], content: `${member}` }) // Caso queira que o usuário não seja mencionado, retire a parte do "content".
})

// Member Unboosted
client.on("guildMemberUnboost", (member) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('O usuário parou de impulsionar o servidor')
        .setColor('#2F3136')
        .setDescription(`**${member.user.tag}** parou de impulsionar ${member.guild.name}!`);

    LogChannel.send({ embeds: [embed] });
})

// Server Boost Level Down
client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('O Servidor perdeu um level')
        .setColor('#2F3136')
        .setDescription(`${guild.name} acabou de perder o level ${oldLevel} para o ${newLevel}`);

    LogChannel.send({ embeds: [embed] });
})

// Role Permission Updated
client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Permissões de cargo atualizadas')
        .setColor('#2F3136')
        .setDescription("O Cargo: " + `\`${role.name}\`` + "teve suas permissões atualizadas");

    LogChannel.send({ embeds: [embed] });
})

// Joined VC
client.on("voiceChannelJoin", (member, channel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Entrou no canal de voz')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " entrou no " + `${channel}` + "!");

    LogChannel.send({ embeds: [embed] });
})

// Left VC
client.on("voiceChannelLeave", (member, channel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Saiu do canal de voz')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " saiu do " + `${channel}` + "!");

    LogChannel.send({ embeds: [embed] });
})

// VC Switch
client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Entrou em outro canal de voz')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " saiu do " + oldChannel.name + " e entrou no " + newChannel.name + "!");

    LogChannel.send({ embeds: [embed] });
})

// User Started to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Usuário iniciou uma transmissão')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " iniciou uma transmissão em " + voiceChannel.name);

    LogChannel.send({ embeds: [embed] });
})

// User Stopped to Stream
client.on("voiceStreamingStop", (member, voiceChannel) => {
    const LogChannel = client.channels.cache.get('1102373980612087810'); // Replace with your channel id
    const embed = new Discord.EmbedBuilder()
        .setTitle('Usuário parou de transmitir')
        .setColor('#2F3136')
        .setDescription(member.user.tag + " parou de transmitir em " + voiceChannel.name);

    LogChannel.send({ embeds: [embed] });
})