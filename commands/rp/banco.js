const Discord = require("discord.js")

module.exports = {
    name: "banco",
    description: "Comando para dar PD.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "valor",
            description: "Informe o valor do saque.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "motivo",
            description: "Informe o motivo do saque.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })

        let valor = interaction.options.getString("valor")
        let motivo = interaction.options.getString("motivo")
        const data = new Date().toLocaleDateString('pt-BR');
        const channel = interaction.guild.channels.cache.get("1074674493039050762")

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Banco - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('SAQUE')
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                { name: "USUÁRIO:", value: `${interaction.user}`, inline: false },
                { name: "VALOR:", value: `${valor}`, inline: false },
                { name: "MOTIVO:", value: `${motivo}`, inline: false },
                { name: "DATA:", value: `${data}`, inline: false })
            .setColor('Random')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp(Date.now())

        interaction.reply({ content: "Operação realizada com sucesso!", ephemeral: true })
        channel.send({ embeds: [embed] })
    }
}