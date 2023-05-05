const Discord = require("discord.js")

module.exports = {
    name: "pd",
    description: "Comando para dar PD.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "informe o usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "informe o motivo.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })

        let user = interaction.options.getUser("usuario")
        let motivo = interaction.options.getString("motivo")
        var member = interaction.guild.members.cache.get(user.id)
        await member.roles.set([]);
        member.roles.add("1102082446461259916")
        const channel = interaction.guild.channels.cache.get("1074674488861540412")

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Sistema de PD - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('Player finalizado (PD)')
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                { name: "Usuário:", value: `${user}`, inline: false },
                { name: "Motivo:", value: `${motivo}`, inline: false },
                { name: "Ação feita por:", value: `${interaction.user}`, inline: false })
            .setColor('Red')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp(Date.now())


        interaction.reply({ content: `O ${user} foi **finalizado** com sucesso!`, ephemeral: true })
        channel.send({ embeds: [embed] })

    }
}