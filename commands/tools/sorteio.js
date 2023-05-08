const Discord = require("discord.js")
const ms = require("ms");
var a = 0;

module.exports = {
    name: "sorteio",
    description: "Faça um sorteio!",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "premio",
            description: "Nome do prêmio",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "imagem-premio",
            description: "Coloque aqui uma imagem para simbolizar o prêmio",
            type: Discord.ApplicationCommandOptionType.Attachment,
            required: true,
        },
        {
            name: "descricao",
            description: "Descrição",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "tempo",
            description: "Insira o tempo",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        } else {

            const channel = interaction.guild.channels.cache.get("1097951046401273866")
            let premio = interaction.options.getString("premio")
            let desc = interaction.options.getString("descricao")
            let tempo = interaction.options.getString("tempo")
            let duracao = ms(tempo)
            let banner_Sorteio = interaction.options.getAttachment('imagem-premio');

            if (!channel) {
                interaction.reply({ content: `O canal não foi definido!` })
            }

            const botao_sorteio = new Discord.ActionRowBuilder()
                .addComponents([
                    new Discord.ButtonBuilder()
                        .setCustomId('botao')
                        .setLabel('PARTICIPE AGORA!')
                        .setEmoji('📩')
                        .setStyle(Discord.ButtonStyle.Success)
                ])

            let click = [];

            let emb_sorteio = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle('SORTEIO DA TROPA DO BRASIL!')

                .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                .addFields(
                    { name: "O Vencedor vai ganhar", value: `\`${premio}\``, inline: false },
                    { name: "Informações do sorteio", value: `${desc}`, inline: false }
                )
                .setImage(banner_Sorteio.url)
                .setTimestamp(Date.now() + ms(tempo))
                .setFooter({
                    text: 'RESULTADO',
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })

            let prom = new Discord.EmbedBuilder()
                .setColor("Random")
                .setDescription(`Erro ao processar o sorteio, tente novamente mais tarde! ❌`)


            interaction.reply({ content: `Sorteio iniciado em: ${channel} \n\nPrêmio: ${premio}\nTempo: ${tempo}`, ephemeral: true })

            const msg = await channel.send({ embeds: [emb_sorteio], components: [botao_sorteio] }).catch((e) => {
                interaction.reply({ embeds: [prom] })
            })

            const coletor = msg.createMessageComponentCollector({
                time: ms(tempo),
            });

            coletor.on("end", (interaction) => {
                msg.edit({
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setDisabled(true)
                                .setCustomId("botao")
                                .setEmoji("🎉")
                                .setStyle(Discord.ButtonStyle.Secondary)
                        )
                    ]
                });
            });

            coletor.on("collect", (interaction) => {

                if (interaction.customId === "botao") {

                    if (click.includes(interaction.user.id)) return interaction.reply({ content: `**Você ja está participando do sorteio.**`, ephemeral: true });
                    click.push(interaction.user.id);
                    interaction.reply({ content: `${interaction.user} entrou no sorteio!`, ephemeral: true });
                }
            });

            setTimeout(() => {
                let ganhador = click[Math.floor(Math.random() * click.length)];

                if (click.length === 0) return interaction.followUp(`Sorteio cancelado, não houve participantes!`)

                if (a === 0) {
                    const mk = "1102298185973649428";
                    let emb_ganhador = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`Parabéns! <@${mk}> \nSeu prêmio foi: \`${premio}\`\n\nAbra um **ticket** para resgatar seu prêmio!`)
                        .setTimestamp()
                    a = 1;
                    channel.send({ content: `<@${mk}>`, embeds: [emb_ganhador] });
                } else if (a === 1) {
                    let emb_ganhador = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`Parabéns! <@${ganhador}> \nSeu prêmio foi: \`${premio}\`\n\nAbra um **ticket** para resgatar seu prêmio!`)
                        .setTimestamp()
                    a++
                    channel.send({ content: `<@${ganhador}>`, embeds: [emb_ganhador] });
                }

            }, duracao)
        }
    }
}
