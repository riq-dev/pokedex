const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "slowmode",
    description: "Configure o modo lento em um canal de texto.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "tempo",
            description: "Escolha o tempo desejado [s|m|h].",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "canal",
            description: "Escolha o canal de texto.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        } else {
            let tempoSetado = interaction.options.getString("tempo");
            let tempo = ms(tempoSetado);
            let channel = interaction.options.getChannel("canal");
            if (!channel || channel === null) channel = interaction.channel;

            if (!tempo || tempo === false || tempo === null) {
                embed.setDescription(`${interaction.user}, tempo inválido: 3s / 2m / 1h`); interaction.reply({ embeds: [embed] })
            } else {
                channel.setRateLimitPerUser(tempo / 1000).then(() => {
                    embed.setDescription(`${interaction.user}, O canal de texto ${channel} teve seu modo lento definido para \`${tempoSetado}\`.`); interaction.reply({ embeds: [embed], ephemeral: true })
                }).catch(() => {
                    embed.setDescription(`${interaction.user}, Algo deu errado. Verifique minhas permissões!`).setColor("Red");
                    interaction.reply({ embeds: [embed], ephemeral: true })
                })
            }
        }
    }
}