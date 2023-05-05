const Discord = require("discord.js")

module.exports = {
    name: "farm",
    description: "Anotar farm entregue.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "quantidade",
            description: "Quantidade do valro entregue.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "usuario",
            description: "Usuário que entregou os farm.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })

        let quantidade = interaction.options.getString("quantidade")
        let usuario = interaction.options.getUser("usuario")
        const channel = interaction.guild.channels.cache.get("1074674495341740086")

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('Farm')
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .setDescription(`${usuario} entregou **${quantidade}** componentes de farm`)
            .addFields({ name: "Ação feita por:", value: `${interaction.user}`, inline: false })
            .setColor('Random')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp(Date.now())

        interaction.reply({ content: `Farm de ${usuario} foi **registrado** com sucesso!`, ephemeral: true })
        channel.send({ embeds: [embed] })
    }
}