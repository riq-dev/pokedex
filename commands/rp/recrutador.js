const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "recrutador",
    description: "Registrar recrutamento.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "recrutado",
            description: "Usuário que foi recrutado.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true });
        }

        let recrutado = interaction.options.getUser("recrutado");
        let recrutador = interaction.user;
        const channel = interaction.guild.channels.cache.get("1104307495675105340")
        const canal_logs = client.channels.cache.get("1103190749467648000");

        if (recrutado.bot) {
            const warn = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription("Você não pode recrutar um bot")
            return interaction.reply({ embeds: [warn], ephemeral: true });
        } else if (recrutado === interaction.user) {
            const warn = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription("Você não pode recrutar a si mesmo")
            return interaction.reply({ embeds: [warn], ephemeral: true });
        }

        if (!fs.existsSync("./recruitingData.json")) {
            fs.writeFileSync("./recruitingData.json", "[]");
        }

        let recruitingData = JSON.parse(fs.readFileSync("./recruitingData.json"));

        let index = recruitingData.findIndex(data => data.recrutador.id === recrutador.id);

        if (index === -1) {
            recruitingData.push({
                recrutador: recrutador,
                recrutados: [recrutado.id] // Adiciona o ID do recrutado ao array de recrutados
            });
        } else {
            if (recruitingData[index].recrutados.includes(recrutado.id)) {
                // Verifica se o usuário já foi recrutado pelo recrutador
                const error = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Este usuário já foi recrutado por você.")
                return interaction.reply({ embeds: [error], ephemeral: true });
            }
            recruitingData[index].recrutados.push(recrutado.id);
        }

        let maiorRecrutador = recruitingData[0];
        for (let i = 1; i < recruitingData.length; i++) {
            if (recruitingData[i].recrutados.length > maiorRecrutador.recrutados.length) {
                maiorRecrutador = recruitingData[i];
            }
        }

        // Move o maior recrutador para o início do array.
        if (maiorRecrutador !== recruitingData[0]) {
            let index = recruitingData.findIndex(data => data.recrutador.id === maiorRecrutador.recrutador.id);
            recruitingData.splice(index, 1);
            recruitingData.unshift(maiorRecrutador);
        }

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('Ranking de Recrutamento')
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .setColor("Random");

        recruitingData.forEach((data, index) => {
            let recrutador = data.recrutador && client.users.cache.get(data.recrutador.id);
            let recrutadorName = recrutador ? recrutador : (recrutador ? recrutador.username : "Usuário não encontrado");

            embed.addFields({
                name: ` `,
                value: `${index + 1}. ${recrutadorName} recrutou **__${data.recrutados.length}__** pessoas.`,
                inline: false
            });
        });
        interaction.reply({ content: "Registrado com sucesso!", ephemeral: true });
        const messages = await channel.messages.fetch();
        await channel.bulkDelete(messages);
        channel.send({ embeds: [embed] });

        fs.writeFileSync("./recruitingData.json", JSON.stringify(recruitingData, null, 2));

        let embed_Log = new Discord.EmbedBuilder()
            .setColor("Green")
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .setAuthor({ name: `Logs recrutamento - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields({ name: `** O Usuário:** `, value: `${interaction.user}`, inline: false })
            .addFields({ name: `** Recrutou:** `, value: `${recrutado}`, inline: false })
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setImage("https://share.creavite.co/j904X3ZNpcnlJATg.gif")
            .setTimestamp(Date.now());
        canal_logs.send({ embeds: [embed_Log] });
    }
};
