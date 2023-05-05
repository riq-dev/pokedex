const Discord = require('discord.js')
client = require('../index')
Wait = require('wait')

client.on("interactionCreate", async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'whitelist') {
            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("RECRUTAMENTO")
                .setDescription(`Clique no **botão** abaixo para iniciar o seu recrutamento!`)
                .setImage("https://share.creavite.co/j904X3ZNpcnlJATg.gif")
            let RoWL = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('iniciar').setLabel('Iniciar recrutamento').setEmoji('📤')
            );

            interaction.message.components[0].components[0].data.disabled = true;
            interaction.update({ components: [interaction.message.components[0]] });
            await interaction.guild.channels.cache.get(interaction.values[0]).send({ embeds: [embed], components: [RoWL] });
        };
    };

    if (interaction.isButton()) {
        if (interaction.customId === 'iniciar') {
            let channelName = `⏳・recrutamento-${interaction.user.username}`
            let existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);
            if (existingChannel) {
                return interaction.reply({ content: `❌ Você já possui um ticket aberto em ${existingChannel}!`, ephemeral: true });
            }
            interaction.deferReply({ ephemeral: true });
            await Wait(500);

            const categoria = "1074830440118091826"
            let canal = await interaction.guild.channels.create(
                {
                    name: `⏳・recrutamento-${interaction.user.username}`,
                    type: Discord.ChannelType.GuildText,
                    parent: categoria,
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
                        ]
                }
            )
            interaction.editReply({ content: `Recrutamento iniciado em ${canal}`, ephemeral: true });

            var userName;

            var embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Sistema de whitelist - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor("DarkerGrey")
                .setTitle("Qual seu nome no jogo?")
                .setDescription(`Você tem 3 minutos para responder cada pergunta.`);
            enviarPergunta1();
            const collectorFilter = (response) => response.author.id === interaction.user.id;

            async function enviarPergunta1() {
                const msg1 = await canal.send({ embeds: [embed] });
                const collector = canal.createMessageCollector({ filter: collectorFilter, max: 1, time: 180000 });

                collector.on('collect', (m) => {
                    userName = m.content;
                    interaction.member.setNickname(`${userName} #?????`);
                    msg1.delete();
                    m.delete();
                    enviarPergunta2();
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        canal.delete();
                    }
                });
            }

            async function enviarPergunta2() {
                embed.setTitle("Qual seu ID no jogo?")

                const msg2 = await canal.send({ embeds: [embed] });
                const collector = canal.createMessageCollector({ filter: collectorFilter, max: 1, time: 180000 });

                collector.on('collect', (m) => {
                    const userID = m.content;
                    interaction.member.setNickname(`${userName} #${userID}`);
                    msg2.delete();
                    m.delete();
                    enviarPerguntaAge();
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        canal.delete();
                    }
                });
            }
            var userAge;
            async function enviarPerguntaAge() {
                embed.setTitle("Qual sua idade na vida real?")
                msgAge = await canal.send({ embeds: [embed] });
                const collector = canal.createMessageCollector({ filter: collectorFilter, max: 1, time: 180000 });

                collector.on('collect', (m) => {
                    userAge = m.content;
                    msgAge.delete();
                    m.delete();
                    enviarPergunta3();
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        canal.delete();
                    }
                });
            }

            var acertos = 0;

            async function enviarPergunta3() {
                embed.setTitle("O que é RDM?")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "Usar o veículo como arma.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Atirar de dentro do veículo.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Matar sem motivo.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg3 = await canal.send({ embeds: [embed], components: [painel] });
                msg3.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'c') {
                        acertos++;
                    }
                    msg3.delete();
                    enviarPergunta4();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta4() {
                embed.setTitle("O que é Power Gaming?")
                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "Usar o veículo como arma.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Abusar da fisica do jogo",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Atirar de dentro do veículo.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg4 = await canal.send({ embeds: [embed], components: [painel] });
                msg4.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'b') {
                        acertos++;
                    }
                    msg4.delete();
                    enviarPergunta5();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta5() {
                embed.setTitle("O que é Combat Logging?")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "Usar informações de fora do jogo.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Fechar o jogo no meio de uma ação.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Forçar um combate.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg5 = await canal.send({ embeds: [embed], components: [painel] });
                msg5.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'b') {
                        acertos++;
                    }
                    msg5.delete();
                    enviarPergunta6();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta6() {
                embed.setTitle("O que é DARK RP")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "RP na noite.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Comprar itens ilegais.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: `Estupro, assédio, pedofília...`,
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg6 = await canal.send({ embeds: [embed], components: [painel] });
                msg6.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'c') {
                        acertos++;
                    }
                    msg6.delete();
                    enviarPergunta7();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta7() {
                embed.setTitle("O que é VDM?")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "Usar o veículo como arma.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Atirar de dentro do veículo.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Esfaquear alguém sem motivo.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg7 = await canal.send({ embeds: [embed], components: [painel] });
                msg7.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'a') {
                        acertos++;
                    }
                    msg7.delete();
                    enviarPergunta8();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta8() {
                embed.setTitle("Quais são as Safe Zones?")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "DP, Hospital e Life Invader.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Hospital, Praça e Cassino.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Hospital, Mecânica e Pier.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg8 = await canal.send({ embeds: [embed], components: [painel] });
                msg8.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'c') {
                        acertos++;
                    }
                    msg8.delete();
                    enviarPergunta9();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function enviarPergunta9() {
                embed.setTitle("O que é Cop Bait?")

                let painel = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId("reponses")
                        .setPlaceholder("Clique aqui!")
                        .addOptions(
                            {
                                label: "Atrair alguém para um local para matar sem motivo/RP prévio.",
                                emoji: "1️⃣",
                                value: "a"
                            },
                            {
                                label: "Executar policias fardados dentro da viatura.",
                                emoji: "2️⃣",
                                value: "b"
                            },
                            {
                                label: "Denegrir imagem de streamers/influencers.",
                                emoji: "3️⃣",
                                value: "c"
                            }
                        )
                )

                const msg9 = await canal.send({ embeds: [embed], components: [painel] });
                msg9.createMessageComponentCollector().on("collect", (interaction, reason) => {
                    const valor = interaction.values[0];
                    if (valor === 'a') {
                        acertos++;
                    }
                    aprovacao();
                });
                setTimeout(() => {
                    canal.delete();
                }, 180000);
            }

            async function aprovacao() {
                canal.delete();
                if (acertos > 3 && userAge > 12) {
                    var member = interaction.guild.members.cache.get(interaction.user.id)
                    await member.roles.set([]);
                    member.roles.add("1102082453578993725")

                    await interaction.member.createDM().then(dm => dm.send({ content: "Parabéns, você foi **aprovado** na melhor tropa da cidade nobre!" }));

                    //log aprovado
                    let canal_Aprovado_ID = "1074830633928491008";
                    let canal_Aprovado = client.channels.cache.get(canal_Aprovado_ID);
                    if (!canal_Aprovado) return;

                    let embed_Log = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                        .setAuthor({ name: `Logs recrutamento - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields({ name: `**O Usuário:** `, value: `${interaction.user}`, inline: false })
                        .addFields({ name: `**Situação:**`, value: `Aprovado ✅`, inline: false })
                        .setFooter({ text: `Staff`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp(Date.now());

                    canal_Aprovado.send({ embeds: [embed_Log] });

                } else {
                    var member = interaction.guild.members.cache.get(interaction.user.id)
                    await member.roles.set([]);
                    member.roles.add("1102661164917338333")

                    await interaction.member.createDM().then(dm => dm.send({ content: "Infelizmente você **não** foi aprovado." }));

                    //log reprovado
                    let canal_Reprovado_ID = "1074830747258597466";
                    let canal_Reprovado = client.channels.cache.get(canal_Reprovado_ID);
                    if (!canal_Reprovado) return;

                    let embed_Log = new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                        .setAuthor({ name: `Logs recrutamento - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields({ name: `**O Usuário:** `, value: `${interaction.user}`, inline: false })
                        .addFields({ name: `**Situação:**`, value: `Reprovado ❌`, inline: false })
                        .setFooter({ text: `Staff`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp(Date.now());

                    canal_Reprovado.send({ embeds: [embed_Log] });
                }
            }
        }
    };
})