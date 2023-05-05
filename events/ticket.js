const Discord = require('discord.js')
client = require('../index')
Wait = require('wait')
Transcript = require('discord-html-transcripts');
const { QuickDB } = require('quick.db');
const DB = new QuickDB();

client.on("interactionCreate", async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'Panel') {
            let Embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                .setTitle("Ticket")
                .setDescription(`Abra um ticket para resolver o seu problema clicando no botão abaixo!`)
                .setImage("https://share.creavite.co/j904X3ZNpcnlJATg.gif")
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Create').setLabel('Abrir ticket').setEmoji('📩')
            );

            interaction.message.components[0].components[0].data.disabled = true;
            interaction.update({ components: [interaction.message.components[0]] });
            await interaction.guild.channels.cache.get(interaction.values[0]).send({ embeds: [Embed], components: [Row] });
        };
    };

    if (interaction.isButton()) {
        if (interaction.customId === 'Create') {
            let channelName = `💡・suporte-${interaction.user.username}`
            let existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);
            if (existingChannel)
                return interaction.reply({ content: `❌ Você já possui um ticket aberto em ${existingChannel}!`, ephemeral: true });

            await DB.add(`AMOUNT_${interaction.guildId}`, 1);
            interaction.deferReply({ ephemeral: true });
            await Wait(1000);

            const category = "1074832676252557412"
            const Quantidade = String(await DB.get(`AMOUNT_${interaction.guildId}`)).padStart(4, "0");
            let Canal = await interaction.guild.channels.create(
                {
                    name: `💡・suporte-${interaction.user.username}`,
                    type: Discord.ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites:
                        [
                            {
                                id: interaction.guildId, deny: [Discord.PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: interaction.user.id, allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions
                                ]
                            },
                            {
                                id: '1074679279482322945',
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions
                                ]
                            },
                            {
                                id: '1074674437456142356',
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions
                                ]
                            },
                            {
                                id: '1074674442275401770',
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions
                                ]
                            },
                        ]
                }
            );

            let Embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("Suporte")
                .setDescription(`Olá ${interaction.user}, logo alguem irá te atender!\nPara agilizar o seu atendimento e evitar o encerramento por inatividade, por favor, informe-nos qual é sua **dúvida/problema**.`)
                .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Close').setLabel('Fechar ticket').setEmoji('🔒')
            );

            Canal.setTopic(interaction.user.id);
            Canal.send({ content: `${interaction.user} Bem-vindo.`, embeds: [Embed], components: [Row] });
            return interaction.editReply({ content: `Ticket criado em ${Canal}`, ephemeral: true });
        };

        if (interaction.customId === 'Close') {
            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('Confirm').setLabel('Fechar'),
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Cancel').setLabel('Cancelar')
            );

            return interaction.reply({ content: "Você tem certeza que deseja fechar o ticket?", components: [Row] });
        };

        if (interaction.customId === 'Cancel') interaction.message.delete();
        if (interaction.customId === 'Confirm') {
            let Embed = new Discord.EmbedBuilder().setColor('Random').setDescription(`Ticket encerrado por ${interaction.user}.`);
            let Other_Embed = new Discord.EmbedBuilder().setColor('Random').setDescription('Painel de controles:');

            let Row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Transcript').setLabel('Transcript').setEmoji('📑'),
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('Delete').setLabel('Apagar').setEmoji('⛔')
            );

            interaction.message.delete();
            await interaction.channel.setName(`🔐・fechado-${interaction.channel.name.slice(-4)}`);
            return interaction.channel.send({ embeds: [Embed, Other_Embed], components: [Row] });
        };

        if (interaction.customId === 'Transcript') return interaction.reply({ files: [await Transcript.createTranscript(interaction.channel)] });

        if (interaction.customId === 'Delete' && !interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: "Você não tem permissão para excluir o canal.", ephemeral: true })
        }

        if (interaction.customId === 'Delete' && interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            /*             const transcript = await Transcript.createTranscript(interaction.channel); // cria o transcript
            
                        await author.createDM().then(dm => dm.send({
                            content: `Olá ${interaction.user}, aqui está o desfecho do seu ticket, basta fazer **download** e abrir o arquivo .html que abrira uma guia no navegador mostrando as mensagens!`,
                            files: [transcript]
                        })); */

            interaction.message.components[0].components[1].data.disabled = true;
            interaction.update({ components: [interaction.message.components[0]] });
            interaction.channel.send({ content: "O canal será removido em 3 segundos..." })
            await Wait(3000); return interaction.channel.delete();
        }
    };
}); 