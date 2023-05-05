const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  name: "adv",
  description: "Sistema de advertência ",
  options: [
    {
      name: "add",
      description: "Adiciona advertência ao usuário.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "usuario",
          description: "Selecione o usuário para ser advertido.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "motivo",
          description: "Motivo da advertencia.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "puniçao",
          description: "Informe a punição.",
          type: ApplicationCommandOptionType.String,
          required: true,
        }
      ],
    },
    {
      name: "remove",
      description: "Remover advertências do usuário",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "usuario",
          description: "Selecione o usuário para remover as advertência.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "motivos",
          description: "Motivo da remoção.",
          type: ApplicationCommandOptionType.String,
          required: true,
        }
      ]
    }
    ,
    {
      name: "verificar",
      description: "Verificar advertência do usuário",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "usuario",
          description: "Selecione o usuário para verificar a advertência.",
          type: ApplicationCommandOptionType.User,
          required: true
        }
      ]
    }
  ],
  run: async (client, interaction) => {
    var usuario = interaction.options.getUser("usuario")
    var motivo = interaction.options.getString("motivo")
    var motivos = interaction.options.getString("motivos")
    var puniçao = interaction.options.getString("puniçao")
    var member = interaction.guild.members.cache.get(usuario.id)
    var adv = member.guild.roles.cache.get("1102082447476269136")
    var adv2 = member.guild.roles.cache.get("1102082448927506594")
    var adv3 = member.guild.roles.cache.get("1102082452605898903")
    const channel = interaction.guild.channels.cache.get("1074831920380268604")

    switch (interaction.options.getSubcommand()) {
      case "add": {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        if (!member.roles.cache.get(adv.id) && !member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          await member.roles.add(adv)
          interaction.reply({ content: 'Advertência adicionada com sucesso!', ephemeral: true })
          var adv_Atual = adv
        } else if (member.roles.cache.get(adv.id) && !member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          await member.roles.add(adv2.id)
          await member.roles.remove(adv.id)
          interaction.reply({ content: 'Segunda advertência adicionada com sucesso!', ephemeral: true })
          var adv_Atual = adv2
        } else if (!member.roles.cache.get(adv.id) && member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          await member.roles.add(adv3)
          await member.roles.remove(adv2)
          interaction.reply({ content: 'Terceira advertência adicionada com sucesso!', ephemeral: true })
          var adv_Atual = adv3
        } else if (member.roles.cache.get(adv3.id)) {
          return interaction.reply({ content: "O usuario excedeu o limite de advertencias", ephemeral: true });
        } else {
          return interaction.reply({ content: "Algo deu errado", ephemeral: true });
        }

        var userObj = { data: Date.now() };
        member.user.advData = userObj;

        setInterval(() => {
          // Percorre todos os membros do servidor
          interaction.guild.members.cache.forEach(member => {
            // Verifica se o membro tem a role "adv"
            if (member.roles.cache.has(adv) ||
              member.roles.cache.has(adv2) ||
              member.roles.cache.has(adv3)) {
              // Verifica se o usuário tem a propriedade "data"
              if (member.user.advData) {
                // Calcula a diferença entre a data atual e a data de "adv"
                var diff = Date.now() - member.user.advData.data;
                // Se a diferença for maior que 30 dias (2592000000 ms), remove a "adv"
                if (diff > 2592000000) {
                  member.roles.remove(adv)
                  member.roles.remove(adv2)
                  member.roles.remove(adv3)
                  // Remove a propriedade "data" do usuário
                  delete member.user.advData;
                }
              }
            }
          });
        }, 3600000); // 1h

        const embed = new EmbedBuilder()
          .setAuthor({ name: `Sistema de advertência - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setTitle('Nova advertência')
          .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
          .setDescription(`O usuário ${usuario} foi advertido.`)
          .addFields(
            { name: "Motivo:", value: `${motivo}`, inline: false },
            { name: "Punição:", value: `${puniçao}`, inline: false },
            { name: "Advertência:", value: `${adv_Atual}`, inline: false },
            { name: "Ação feita por:", value: `${interaction.user}`, inline: false })
          .setColor('Yellow')
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setTimestamp(Date.now())
        interaction.reply({ content: "**Advertência** aplicada com sucesso!", ephemeral: true })
        channel.send({ embeds: [embed] })
        break;

      } case "remove": {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        if (member.roles.cache.get(adv.id) && !member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          member.roles.remove(adv.id)
          interaction.reply({ content: 'Advertência removida com sucesso!', ephemeral: true })
        } else if (member.roles.cache.get(adv.id) && member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id) || member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          member.roles.remove(adv2.id)
          member.roles.add(adv.id)
          interaction.reply({ content: 'Segunda advertência removida com sucesso!', ephemeral: true })
        } else if (member.roles.cache.get(adv.id) && member.roles.cache.get(adv2.id) && member.roles.cache.get(adv3.id) || member.roles.cache.get(adv2.id) && member.roles.cache.get(adv3.id) || member.roles.cache.get(adv.id) && member.roles.cache.get(adv3.id) || member.roles.cache.get(adv3.id)) {
          member.roles.remove(adv)
          member.roles.remove(adv3)
          member.roles.add(adv2)
          interaction.reply({ content: 'Terceira advertência removida com sucesso!', ephemeral: true })
        } else if (!member.roles.cache.get(adv.id) && !member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          return interaction.reply({ content: "O usuário não possui nenhuma advertência", ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setAuthor({ name: `Sistema de advertência - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setTitle('Advertência removida!')
          .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
          .setDescription(`O usuário ${usuario} teve sua advertência **removida**!`)
          .addFields(
            { name: "Motivo:", value: `${motivos}`, inline: false },
            { name: "Ação feita por:", value: `${interaction.user}`, inline: false })
          .setColor('Green')
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setTimestamp(Date.now())
        channel.send({ embeds: [embed] })
        break;
      } case "verificar": {
        if (member.roles.cache.get(adv.id) && !member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          interaction.reply({ content: 'O usuário possui 1 advertências.', ephemeral: true })
        } else if (member.roles.cache.get(adv.id) && member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id) || member.roles.cache.get(adv2.id) && !member.roles.cache.get(adv3.id)) {
          interaction.reply({ content: 'O usuário possui 2 advertências.', ephemeral: true })
        } else if (member.roles.cache.get(adv.id) && member.roles.cache.get(adv2.id) && member.roles.cache.get(adv3.id) || member.roles.cache.get(adv3.id)) {
          interaction.reply({ content: 'O usuário possui 3 advertências.', ephemeral: true })
        } else {
          return interaction.reply({ content: "O usuário não possui nenhuma advertência", ephemeral: true });
        }
        break;
      }
    }
  }
}