const Discord = require('discord.js');

module.exports = {
    name: "setup",
    description: "Setar o painel de ticket",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Você não possui permissão de utilizar este comando.", ephemeral: true });

        let Row = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder().setPlaceholder('Selecione o canal do ticket.').setCustomId('Panel')
        );

        let count = 0;

        await interaction.guild.channels.fetch().then(response => {
            response.forEach(element => {
                if (element.type != 0 || count > 24) return; 
                Row.components[0].addOptions({ label: `Canal: ${element.name}`, value: element.id });
                count++; 
            });
        });
        interaction.reply({ content: "**Ticket Tools**", ephemeral: true, components: [Row] });
    }
};