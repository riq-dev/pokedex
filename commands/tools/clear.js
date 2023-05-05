const Discord = require("discord.js")
const Transcripts = require('discord-html-transcripts')

module.exports = {
    name: "clear",
    description: "Apaga mensagens no chat.",
    options: [
        {
            name: "quantidade",
            description: "Informe a quantidade de mensagens que deseja apagar.",
            type: Discord.ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 100,
            required: true,

        },
        {
            name: "usuario",
            description: "Selecione o usuário pelo qual deseja apagar as mensagens.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
        },
    ],

    run: async (client, interaction) => {
        let amount = interaction.options.getInteger("quantidade");
        let user = interaction.options.getUser("usuario");
        let embed = new Discord.EmbedBuilder().setColor("Random").setImage("https://share.creavite.co/j904X3ZNpcnlJATg.gif");

        const Messages = await interaction.channel.messages.fetch();
        const logsChannel = interaction.guild.channels.cache.get("1101214008951963739")
        const embedLogs = new Discord.EmbedBuilder()
            .setColor('Aqua')
            .setAuthor({ name: "Comando usado por:" })

        let embedLogsDesc = [
            `Moderador: ${interaction.user}`,
            `Usuário: ${user || "Não especificado"}`,
            `Canal: ${interaction.channel}`
        ]


        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        } else if (user) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if (m.author.id === user.id && amount > i) {
                    filtered.push(m);
                    i++;
                }
            });

            const Transcript = await Transcripts.generateFromMessages(filtered, interaction.channel)

            interaction.channel.bulkDelete(filtered, true).then(async (messages) => {
                embed.setTitle(`**__${messages.size}__** mensagens de ${user.tag} foram apagadas.`);
                await interaction.reply({ embeds: [embed], ephemeral: true });

                embedLogsDesc.push(`Mensagens totais: ${messages.size}`)

                logsChannel.send({
                    embeds: [embedLogs.setDescription(embedLogsDesc.join("\n"))],
                    files: [Transcript]
                })

            });

        } else {
            const Transcript = await Transcripts.createTranscript(interaction.channel, { limit: amount })

            interaction.channel.bulkDelete(amount, true).then(async (messages) => {
                embed.setTitle(`**__${messages.size}__** mensagens foram apagadas.`);
                interaction.reply({ embeds: [embed], ephemeral: true });

                embedLogsDesc.push(`Mensagens totais: ${messages.size}`)
                logsChannel.send({
                    embeds: [embedLogs.setDescription(embedLogsDesc.join("\n"))],
                    files: [Transcript]
                })
            });
        }
        setTimeout(() => { interaction.deleteReply() }, 5000)
    }
}
