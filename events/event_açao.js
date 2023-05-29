const Discord = require('discord.js');
const Client = require('../index')
const Config = require('../config.json');
const String = require('randomstring');
const { QuickDB } = require("quick.db");
const DB = new QuickDB();

Client.on("interactionCreate", async interaction => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'Cadastro_Modal') {
            let ID = interaction.fields.getTextInputValue('Identificação');
            let Name = interaction.fields.getTextInputValue('Nome');
            let Horario = interaction.fields.getTextInputValue('Horario');
            let Data = interaction.fields.getTextInputValue('Data');
            let Contingente = parseInt(interaction.fields.getTextInputValue('Contingente'));

            if (!Contingente) return interaction.reply({ content: "Informe somente números na quantidade de participantes!", ephemeral: true });

            await DB.set(ID,
                {
                    "Nome_DB": Name,
                    "Contingente_DB": Contingente,
                    "Horario_DB": Horario,
                    "Data_DB": Data,
                    "Participantes": [],
                    "Resp_DB": interaction.user.id,
                })

            //console.log(await DB.get(ID));
            return interaction.reply({ content: "Ação registrada com sucesso!", ephemeral: true });
        };
    };

    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'Seletor_Menu') {
            let Selecionado = interaction.values[0];

            let Ação = await DB.get(Selecionado);
            if (!Ação) return interaction.reply({ content: 'Ação inexistente!', ephemeral: true });

            let Embed = new Discord.EmbedBuilder()
                .setColor('#2F3136')
                .setTitle('📌 Deseja confirmar a ação?\n')
                .setDescription(
                    `**Ação: **\`${Ação.Nome_DB}\`
                     **Contingente: **\`${Ação.Contingente_DB}\`
                     **Horário:** \`${Ação.Horario_DB}\`
                     **Data: **\`${Ação.Data_DB}\``)

            let Menu = new Discord.ActionRowBuilder()
                .addComponents(new Discord.StringSelectMenuBuilder()
                    .setCustomId('Ações_Opções')
                    .setPlaceholder('Clique para selecionar uma opção.')
                    .addOptions(
                        { label: `Iniciar escaçação`, emoji: "🚀", value: `Escalação_${Selecionado}` }
                    ));

            return interaction.reply({ embeds: [Embed], components: [Menu], ephemeral: true })
                .then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 40000);
                })
        };

        if (interaction.customId === 'Ações_Opções') {
            let Selecionado = interaction.values[0];

            if (Selecionado.startsWith('Escalação_')) {
                let ID = Selecionado.replace("Escalação_", "");
                let Ação = await DB.get(ID);

                let channel_Name = Ação.Nome_DB.toLowerCase();
                if (channel_Name.includes(" ")) {
                    channel_Name = channel_Name.replace(/\s+/g, "-");
                }

                if (interaction.guild.channels.cache.find(channel => channel.name === `🔴・${channel_Name}`))
                    return interaction.reply({ content: "Esta ação já está em aberto.", ephemeral: true });

                await interaction.deferReply({ ephemeral: true });

                interaction.guild.channels.create({
                    name: `🔴・${channel_Name}`,
                    parent: Config.categoria_acao,
                    type: Discord.ChannelType.GuildText,
                }).then(async Canal => {

                    let Embed = new Discord.EmbedBuilder()
                        .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setColor('#2F3136')
                        .setTitle(`Ação - ${Ação.Nome_DB}`)
                        .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                        .addFields(
                            { name: "Horário: ", value: `\`${Ação.Data_DB} às ${Ação.Horario_DB}\``, inline: false },
                            { name: "Contingente:", value: `\`${Ação.Contingente_DB} membros\``, inline: false },
                            { name: "Resp. Ação:", value: `<@${Ação.Resp_DB}>`, inline: false },
                            { name: "Participantes:", value: ` `, inline: false },)
                        .setFooter({ text: 'Caso queira participar basta clicar no botão abaixo!', });

                    let Button = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Success)
                            .setEmoji('🥊')
                            .setLabel('Participar')
                            .setCustomId(`Participar_${ID}`)
                    );

                    return Canal.send({ embeds: [Embed], components: [Button] }).then(message => {
                        let emb_aberto = new Discord.EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`Ação marcada com sucesso!`)

                        Button = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel('Ir para ação')
                                .setEmoji('💥')
                                .setURL(message.url)
                        );

                        interaction.editReply({ embeds: [emb_aberto], components: [Button], ephemeral: true });
                    })
                });
            };
        };
    };

    if (interaction.isButton()) {
        if (interaction.customId.startsWith('Participar_')) {
            let acaoId = interaction.customId.replace("Participar_", "");
            let Ação = await DB.get(acaoId);

            let Button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Success)
                    .setEmoji('🥊')
                    .setLabel('Participar')
                    .setCustomId(`Participar_${acaoId}`)
            );

            if (!Ação.Participantes.includes(interaction.user.id)) {

                Ação.Participantes.push(interaction.user.id);
                await DB.set(acaoId, Ação);

                let participantesList = Ação.Participantes.map(user => `<@${user}>`).join('\n');
                participantesList = participantesList.replace(/,/g, '');

                let embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor('#2F3136')
                    .setTitle(`Ação - ${Ação.Nome_DB}`)
                    .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                    .addFields(
                        { name: "Horário: ", value: `\`${Ação.Data_DB} às ${Ação.Horario_DB}\``, inline: false },
                        { name: "Contingente:", value: `\`${Ação.Contingente_DB} membros\``, inline: false },
                        { name: "Resp. Ação:", value: `<@${Ação.Resp_DB}>`, inline: false },
                        { name: "Participantes:", value: participantesList, inline: false },
                    )
                    .setFooter({ text: 'Caso queira participar basta clicar no botão abaixo!' });

                await interaction.update({ embeds: [embed], components: [Button] });

                if (Ação.Participantes.length === Ação.Contingente_DB) {
                    let Button = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setDisabled(true)
                            .setCustomId("botao")
                            .setEmoji("🏆")
                            .setStyle(Discord.ButtonStyle.Secondary)
                    );
                    await interaction.editReply({ components: [Button] });
                }
            } else {
                interaction.reply({ content: "Você já está participando desta ação!", ephemeral: true })
            }
        }
    }
});