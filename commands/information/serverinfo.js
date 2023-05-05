const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Envia as informações do atual servidor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        const nome = interaction.guild.name;
        const membros = interaction.guild.memberCount;
        const criacao = interaction.guild.createdAt.toLocaleDateString("pt-br");
        const canais_total = interaction.guild.channels.cache.size;
        const canais_texto = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildText).size;
        const canais_voz = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice).size;
        const canais_categoria = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildCategory).size;

        const embed1 = new Discord.EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: nome, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                {
                    name: `💻 Nome:`,
                    value: `\`${nome}\``,
                    inline: true
                },
                {
                    name: `👥 Membros:`,
                    value: `\`${membros}\``,
                    inline: true
                },
                {
                    name: `📅 Criação:`,
                    value: `\`${criacao}\``,
                    inline: true
                },
                {
                    name: `📤 Canais Totais:`,
                    value: `\`${canais_total}\``,
                    inline: true
                },
                {
                    name: `📝 Canais de Texto:`,
                    value: `\`${canais_texto}\``,
                    inline: false
                },
                {
                    name: `🔊 Canais de Voz:`,
                    value: `\`${canais_voz}\``,
                    inline: false
                },
                {
                    name: `📅 Categorias:`,
                    value: `\`${canais_categoria}\``,
                    inline: false
                }
            );

        interaction.reply({ embeds: [embed1] })
    }
}