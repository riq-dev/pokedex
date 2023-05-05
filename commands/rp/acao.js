const Discord = require("discord.js")
let click = [];
module.exports = {
    name: "açao",
    description: "Marcar uma ação.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nome",
            description: "Nome da ação Nióbio/Banco",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "contingente",
            description: "Total de participantes",
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "horario",
            description: "Informe o horário da ação",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "data",
            description: "Informe a data da ação",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "arma",
            description: "Pistola/Fuzil/Submetralhadora",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        }
        let nome = interaction.options.getString("nome")
        let contingente = interaction.options.getInteger("contingente")
        let horario = interaction.options.getString("horario")
        let data = interaction.options.getString("data")
        let arma = interaction.options.getString("arma")
        const channel = interaction.guild.channels.cache.get('1103843163287855264')

        const botao_Acao = new Discord.ActionRowBuilder()
            .addComponents([
                new Discord.ButtonBuilder()
                    .setCustomId('botao')
                    .setLabel('PARTICIPAR')
                    .setEmoji('🥊')
                    .setStyle(Discord.ButtonStyle.Primary)
            ])

        emb_Acao = new Discord.EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor('#2F3136')
            .setTitle(`Ação - ${nome}`)
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                { name: "Horário: ", value: `\`${data} às ${horario}\``, inline: false },

                { name: "Armamento:", value: `\`${arma}\` `, inline: false },

                { name: "Contingente:", value: `\`${contingente} membros\``, inline: false },

                { name: "Resp. da ação:", value: `${interaction.user}`, inline: false },

                { name: "Contingente:", value: ` `, inline: false },)
            .setFooter({
                text: 'Caso queira participar basta clicar no botão abaixo!',
            })

        interaction.reply({ content: `Ação marcada com sucesso!`, ephemeral: true })
        let msg = await channel.send({ embeds: [emb_Acao], components: [botao_Acao] });

        var coletor = channel.createMessageComponentCollector({
            filter: (interaction) => interaction.customId === "botao"
        });

        interaction.channel.client.on('messageDelete', (deletedMessage) => {
            if (deletedMessage.id === msg.id) {
                coletor.stop();
            }
        });

        var contador = 0;

        coletor.on("collect", (interaction) => {
            if (interaction.customId === "botao") {
                if (click.includes(interaction.user.id))
                    return interaction.reply({ content: `**Você ja está participando da ação.**`, ephemeral: true });
                click.push(interaction.user.id);

                const participante = interaction.user;
                emb_Acao.addFields({
                    name: ` `,
                    value: `➥ ${participante}`,
                    inline: false
                });

                msg.edit({ embeds: [emb_Acao], components: [botao_Acao] })
                interaction.reply({ content: `${interaction.user} entrou na ação ${nome}`, ephemeral: true })
                contador++

                if (contador === contingente) {
                    msg.edit({
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setDisabled(true)
                                    .setCustomId("botao")
                                    .setEmoji("🏆")
                                    .setStyle(Discord.ButtonStyle.Secondary)
                            )
                        ]
                    });
                    coletor.stop();
                }
                return msg;
            }
        })
    }
}