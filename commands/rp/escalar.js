const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const DB = new QuickDB();

module.exports = {
    name: "escalar",
    description: "Escalar ação.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        }

        let Vez = 0;
        let Seletor = new Discord.ActionRowBuilder()
            .addComponents(new Discord.StringSelectMenuBuilder()
                .setCustomId('Seletor_Menu')
                .setPlaceholder('Clique para selecionar uma opção.'));

        let Itens = await DB.all();

        if (Itens.length < 1)
            return interaction.reply({ content: "Nenhuma ação foi registrada.", ephemeral: true });

        Itens.forEach(response => {
            Seletor.components[0].addOptions(
                {
                    label: `ID: ${response.id} 
                    - ${response.value.Nome_DB} ${response.value.Data_DB} às ${response.value.Horario_DB}`,
                    value: `${response.id}`
                }
            );
            Vez++
        });

        return interaction.reply({ content: "Selecione a ação para ser escalada.", components: [Seletor], ephemeral: true });
    }
};