const Discord = require('discord.js'); module.exports = {
    name: "whitelist",
    description: "Setar o painel de whitelist",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Você não possui permissão de utilizar este comando.", ephemeral: true });

        let RoWL = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder().setPlaceholder('Selecione o canal para setar o sistema de WL.').setCustomId('whitelist')
        );

        let count = 0;
        await interaction.guild.channels.fetch().then(response => {
            response.forEach(element => {
                if (element.type != 0 || count > 24) return;
                RoWL.components[0].addOptions({ label: `Canal: ${element.name}`, value: element.id });
                count++;
            });
        });
        interaction.reply({ content: "**Whitelist Tools**", ephemeral: true, components: [RoWL] });
    }
};