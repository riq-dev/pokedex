const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const DB = new QuickDB();

module.exports = {
    name: "registrar",
    description: "Registre uma nova Ação/evento.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "identificação",
            description: 'Exemplo: "niobio" ou "bc" .',
            type: 3,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        }

        let Selecionado = interaction.options.getString('identificação');
        let Ação = await DB.get(Selecionado);
        if (Ação) return interaction.reply({ content: 'Ação já existente!', ephemeral: true });

        let Janela = new Discord.ModalBuilder()
            .setCustomId('Cadastro_Modal')
            .setTitle('Sistema de Ações');

        const PrimeiroActionRow = new Discord.ActionRowBuilder()
            .addComponents(new Discord.TextInputBuilder()
                .setCustomId('Identificação')
                .setLabel('Identificador da Ação/Evento ex: "bc".')
                .setValue(Selecionado)
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true));

        const SegundoActionRow = new Discord.ActionRowBuilder()
            .addComponents(new Discord.TextInputBuilder()
                .setCustomId('Contingente')
                .setLabel("Quantos participantes?")
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true));

        const TerceiroActionRow = new Discord.ActionRowBuilder()
            .addComponents(new Discord.TextInputBuilder()
                .setCustomId('Horario')
                .setLabel("Qual será o horário?")
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true));

        const QuartoActionRow = new Discord.ActionRowBuilder()
            .addComponents(new Discord.TextInputBuilder()
                .setCustomId('Data')
                .setLabel("Que dia será a Ação/Evento?")
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true));

        const QuintoActionRow = new Discord.ActionRowBuilder()
            .addComponents(new Discord.TextInputBuilder()
                .setCustomId('Nome')
                .setLabel("Qual será o nome da Ação/Evento")
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true));

        Janela.addComponents(PrimeiroActionRow, QuintoActionRow, TerceiroActionRow, QuartoActionRow, SegundoActionRow);
        return interaction.showModal(Janela);
    }
};