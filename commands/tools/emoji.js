const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, parseEmoji, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    name: "emoji",
    description: "Gerencia o modo de emojis.",
    options: [
        {
            name: "add",
            description: "Adiciona emoji no servidor.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "emoji",
                    description: "Selecione o emoji que você quer adicionar ao servidor.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "nome",
                    description: "Digite o nome do emoji.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                }
            ],
        }, {
            name: "remove",
            description: "Selecione o emoji que você quer remover do servidor.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "emoji",
                    description: "Selecione o emoji que você quer remover do servidor.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
            ]
        }
    ],
    run: async (client, interaction) => {

        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (!interaction.channel.permissionsFor(interaction.user).has(PermissionFlagsBits.ManageEmojisAndStickers)) {
                    return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
                }

                let name = interaction.options.getString("nome");
                const string = interaction.options.getString("emoji");

                const error_embed = new EmbedBuilder()
                    .setColor("#765cf5")
                    .setDescription("Não foi possível adicionar emojis, verifique se você atingiu o limite de emojis no servidor\n> Lembre-se, você só pode adicionar emojis personalizados");

                const parsed = parseEmoji(string);

                const link = `https://cdn.discordapp.com/emojis/${parsed.id}${parsed.animated ? '.gif' : '.png'}`;

                if (!name) name = parsed.name;

                interaction.guild.emojis
                    .create({ attachment: link, name: `${name}` })
                    .then((em) => {
                        interaction.reply({ content: `${em} **|** ${interaction.user} Emoji adicionado com sucesso!` })
                    })
                    .catch((error) => {
                        console.log(error)
                        return interaction.reply({
                            embeds: [error_embed],
                            ephemeral: true,
                        });
                    });
                break;
            }

            case "remove": {

                if (!interaction.channel.permissionsFor(interaction.user).has(PermissionFlagsBits.ManageEmojisAndStickers)) {
                    return interaction.reply({ content: `Você precisa da permissão \`ManageEmojisAndStickers\` para usar esse comando.`, ephemeral: true })
                } else {
                    try {
                        const emojiQuery = interaction.options.getString("emoji")?.trim();
                        const emoji = await interaction.guild.emojis.fetch().then((emojis) => {
                            return emojis.find(
                                (x) => x.name === emojiQuery || x.toString() == emojiQuery
                            );
                        }).catch((err) => console.log(err));

                        if (!emoji) {
                            return interaction.reply({
                                content: "Não consegui encontrar nenhuma informação sobre o emoji.",
                                ephemeral: true,
                                allowedMentions: { repliedUser: true }
                            })
                        }

                        emoji.delete().then(async () => {
                            await interaction.reply({
                                content: `**O emoji \`${emoji.name}\`** foi removido com sucesso.`,
                                allowedMentions: { repliedUser: true },
                            });
                        }).catch((err) => {
                            // Erro ao remover o emoji do servidor
                            console.log(err); // Registro no console para fins de depuração
                            interaction.reply({
                                content: "Não foi possível remover o emoji do servidor.",
                                ephemeral: true,
                                allowedMentions: { repliedUser: true },
                            });
                        });
                    } catch (err) {
                        // Ocorreu um erro ao procurar o emoji e/ou a obter detalhes do mesmo
                        console.log(err); // Registro no console para fins de depuração
                        interaction.reply({
                            content: "Não foi possível obter informações do emoji inserido.",
                            ephemeral: true,
                            allowedMentions: { repliedUser: true },
                        });
                    }
                    break;
                }
            }
        }
    }
}