const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const DB = new QuickDB();

module.exports = {
    name: "remover",
    description: "Delete uma Ação/evento existente.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "identificação",
            description: "ID da ação.",
            type: 3,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        }

        let ID = interaction.options.getString('identificação');
        let Ação = await DB.get(ID);
        if (!Ação) return interaction.reply({ content: 'Ação inexistente!', ephemeral: true });

        await DB.delete(ID).then(() => {
            return interaction.reply({ content: 'Ação deletada com sucesso!', ephemeral: true });
        });
    }
};